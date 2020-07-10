import React from "react";

export class Canvas extends React.Component {
  constructor(props){
    super(props);
    this.state = {map: null}
  }
  componentDidMount(){
    const mapH = this.refs.mapholder;
    var map = L.map(mapH);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
        
    this.setState({map});
  }
  
  click(e){
    this.move(e);
    this.props.setClipboard(this.state.BC);
  }
  
  move(e){
    this.props.setLatitude(e.latlng.lat);
    this.props.setLongitude(e.latlng.lng);
    this.state.BC = this.state.getBC(e.latlng.lng,e.latlng.lat);
    this.props.setBC(this.state.BC);
  }
  
  componentDidUpdate(){
    for(i in this.state.oldPolyR)
      this.state.oldPolyR[i].remove();
    this.state.oldPolyR=[];
    
    const methodColor = {Terzaghi:[200,200,200],Meyerhof:[200,200,0],Hansen:[0,200,200],Vesic:[200,0,200],Teng:[200,0,0],Plasix:[0,200,0],Minimum:[0,0,200]};
    var methodC=methodColor[this.props.method];
    var depthX=1-(this.props.depth-1.5)/4.5/2;
    var color='rgb('+methodC[0]*depthX+','+methodC[1]*depthX+','+methodC[2]*depthX+')';

    var i,j;
    const dis = this.props.config.district[this.props.district];
    
    if(this.props.showLocation)
      for (i in dis.points.f){
        if(dis.points.f[i]){
          var marker = L.marker([dis.points.y[i], dis.points.x[i]]).addTo(this.state.map);
          this.state.oldPolyR.push(marker);
        }
      }
    
    var pgroup = [];
    pgroup.push(dis.points);
    for (i in dis.neighbours){
      if(this.props.config.district[dis.neighbours[i]]){
        pgroup.push(this.props.config.district[dis.neighbours[i]].points);
      }
    }
    //console.log(pgroup);
    const ind = this.props.config.methods.indexOf(this.props.method);
    function interpolate(x1,x2,r){
      return x1*(1-r)+x2*r;
    }
    //console.log(ind);
    var points = pgroup.map(i=>{
      var out = []
      for (j in i.x){
        var interpolated;
        if (this.props.depth<=3.0){
          interpolated=interpolate(i.c[j*3][ind], i.c[j*3+1][ind], (this.props.depth-1.5)/1.5)
        }else{
          interpolated=interpolate(i.c[j*3+1][ind], i.c[j*3+2][ind], (this.props.depth-3.0)/1.5)
        }
        out.push([i.x[j],i.y[j],interpolated]);
      }
      return out;
    }).flat();
    function getBC(lat,lon){
      var nearest = [null,null,null];// small to larger
      var dis = [1000000,1000000,1000000];
      for(i in points){
        var dist = Math.sqrt((points[i][0]-lat)*(points[i][0]-lat)+(points[i][1]-lon)*(points[i][1]-lon));
        if (dist<dis[0]){
          dis[0]=dist;
          nearest[0]=points[i];
        }else if(dist<dis[1]){
          dis[0]=dis[1];
          nearest[0]=nearest[1];
          dis[1]=dist;
          nearest[1]=points[i];
      }else {
          dis[0]=dis[1];
          nearest[0]=nearest[1];
          dis[1]=dis[2];
          nearest[1]=nearest[2];
          dis[2]=dist;
          nearest[2]=points[i];
        }
      }
      //console.log(nearest,dis);
      var sum=0.;
      for (i in nearest){
        if(nearest[i]!=null)
          sum+=dis[i];
      }
      var intrep=0.;
      for (i in nearest){
        if(nearest[i]!=null)
          intrep+=dis[i]/sum*nearest[i][2];
      }
      return intrep;
    }
    this.state.getBC=getBC;
    
    function getPolyline(geometry){
      var out = [];
      for (i=0;i<geometry.x.length;i++){
        var point = [geometry.y[i],geometry.x[i]];
        out.push(point);
      }
      return out;
    }
        
    var polygon = L.polygon(getPolyline(dis.geometry), {color}).addTo(this.state.map);
    this.state.map.fitBounds(polygon.getBounds());
    polygon.on('click',this.click.bind(this));
    polygon.on('mousemove',this.move.bind(this));
    
    this.state.oldPolyR.push(polygon);
  }
  
  render(props){
    return(
      <div style={{width:400,height:300,position:"absolute"}} ref="mapholder">
      </div>
    )
  }
}

import { connect } from "react-redux";
const mapStateToProps = state => {
  return {
    district: state.state.district,
    config: state.config,
    showLocation: state.state.showLocation,
    method: state.state.method,
    depth: state.state.depth
  };
};

import actionCreater from '../redux/actionCreators.jsx';
const mapDispatchToProps = dispatch => ({
  setGetBC: (d) => dispatch(actionCreater.setState('getBC',d)),
  setClipboard: (d) => dispatch(actionCreater.setState('clipboard',d)),
  setLatitude: (d) => dispatch(actionCreater.setState('latitude',d)),
  setLongitude: (d) => dispatch(actionCreater.setState('longitude',d)),
  setBC: (d) => dispatch(actionCreater.setState('BC',d)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);