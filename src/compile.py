import geopandas as gpd
from shapely.geometry import Point, LineString, Polygon
import json

fp = "./shapes/npl_admbnda_districts_nd_20190430.shp"
datas = "./in/result.csv"
out = {}
out['district'] = {}
out['methods'] = ['Terzaghi','Meyerhof','Hansen','Vesic','Teng','Plasix','Minimum']
out['threshold'] = 0.05

data = gpd.read_file(fp)
rdata = gpd.read_file(datas)

rdata.crs = data.crs
rdata['f'] = [False]*len(rdata)
for i in range(len(rdata)):
    rdata['geometry'][i] = Point(float(rdata['long'][i]), float(rdata['lat'][i]))

locations = list(set(rdata['location']))
#all locations
points = []
#their lat,long
for i in locations:
    r=rdata[(rdata.location==i)]['geometry']
    fi =r.first_valid_index() 
    r=r[fi]
    rdata['f'][fi] = True
    points.append(r)
districts = []
#their districts
for i in points:
    for j in range(len(data)):
        if data['geometry'][j].contains(i):
            districts.append(j)
            break

def locToDistrict(l):
    j=locations.index(l)
    return districts[j]
    
def polygonToArray(pol):
    geom = pol.boundary.xy
    out={}
    out['x']=[]
    out['y']=[]
    c = int(len(geom[0])/600)
    for i in range(len(geom[0])):
        if(i%c==0):
            out['x'].append(format(geom[0][i],'.4f'))
            out['y'].append(format(geom[1][i],'.4f'))
    #out['b'] = pol.bounds
    return out;
    
district=list(set(districts))
while(len(district)):
    j = district.pop()
    name=data['DIST_EN'][j]
    print('- ',name)
    out['district'][name] = {}
    a=out['district'][name]
    #---------------------------------------------------------
    #add points
    a['points'] = {}
    a['points']['x'] = []
    a['points']['y'] = []
    a['points']['c'] = []
    a['points']['f'] = []
    np=0
    for i in range(len(rdata)):
        if(data['geometry'][j].contains(rdata['geometry'][i])):
            if(i%3==0):
                a['points']['x'].append(rdata['geometry'][i].x)
                a['points']['y'].append(rdata['geometry'][i].y)
                a['points']['f'].append(bool(rdata['f'][i]))
            a['points']['c'].append([
                rdata['terzaghi'][i],
                rdata['meyerhof'][i],
                rdata['hansen'][i],
                rdata['vesic'][i],
                rdata['teng'][i],
                rdata['plasix'][i],
                rdata['min'][i]
            ])
            np=np+1
    #save border
    a['geometry']=polygonToArray(data['geometry'][j])
    #neighbour districts too
    if (np<1):#we wouldn't display it
        continue
    a['neighbours'] = []
    for i in range(len(data)):
        if i==j:
            continue
        rep1 = data['geometry'][j]
        rep2 = data['geometry'][i]
        #dist=rep1.distance(rep2)
        if(rep1.intersects(rep2)):
            #print(data['DIST_EN'][i])
            #add neighbours if not in array
            if (i in districts):
                a['neighbours'].append(data['DIST_EN'][i])
    #--------------------------------------------------

with open('result.json','w') as f:
    json.dump(out, f)