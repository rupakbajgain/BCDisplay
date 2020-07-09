import React from "react";

export class Canvas extends React.Component {
  constructor(props){
    super(props);
    this.state = {canvas: null, ctx: null}
  }
  componentDidMount(){
    const canvas = this.refs.mainCanvas;
    const ctx = canvas.getContext("2d");
    this.setState({canvas, ctx});
    this.props.setCanvas(canvas);
    //console.log(ctx);
  }   
  componentDidUpdate(){
    //Draw map
    const methodColor = {Terzaghi:[200,200,200],Meyerhof:[200,200,0],Hansen:[0,200,200],Vesic:[200,0,200],Teng:[200,0,0],Plasix:[0,200,0],Minimum:[0,0,200]};
    var i,j;
    var methodC=methodColor[this.props.method];
    var depthX=1-(this.props.depth-1.5)/4.5/2;
    var color='rgb('+methodC[0]*depthX+','+methodC[1]*depthX+','+methodC[2]*depthX+')';
    const dis = this.props.config.district[this.props.district];
    const scale = Math.min(400/(dis.geometry.b[2]-dis.geometry.b[0]),300/(dis.geometry.b[3]-dis.geometry.b[1]))/1.35;
    const xadd = (400-(dis.geometry.b[2]-dis.geometry.b[0])*scale)/2;
    const yadd = (300-(dis.geometry.b[3]-dis.geometry.b[1])*scale)/2;
    const U2D = function(x, y){return [(x-dis.geometry.b[0])*scale+xadd,300-(y-dis.geometry.b[1])*scale-yadd]};
    const D2U = function(x, y){return [(x-xadd)/scale+dis.geometry.b[0],(y-300+yadd)/-scale+dis.geometry.b[1]]};
    this.props.setD2U(D2U);
    this.props.setU2D(U2D);

    var pgroup = [];
    pgroup.push(dis.points);
    for (i in dis.neighbours){
      pgroup.push(this.props.config.district[dis.neighbours[i]].points);
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
    this.props.setGetBC(getBC);
    var ctx=this.state.ctx;
    const start=U2D(dis.geometry.b[0],dis.geometry.b[1]);
    const end=U2D(dis.geometry.b[2],dis.geometry.b[3]);
    const _startX=Math.floor(start[0]),_startY=Math.floor(start[1]);
    const _endX=Math.floor(end[0]),_endY=Math.floor(end[1]);
    
    for(i=0;i<3;i++)
      for(j=0;j<3;j++)
        getBC(i,j);
    
/*    var canvasData = new ImageData(_endX-_startX,_startY-_endY);
    function drawPixel (x, y, r, g, b) {
      x=x-_startX;
      y=y-_endY;
      var index = (x + y * (_endX-_startX)) * 4;

      canvasData.data[index + 0] = r;
      canvasData.data[index + 1] = g;
      canvasData.data[index + 2] = b;
      canvasData.data[index + 3] = 255;
    }*/
//    function updateCanvas() {
//      ctx.putImageData(canvasData, 0, 0);
//    }
    //console.log(start,end);
    //for (i=_startX;i<_endX;i++)
    //  for(j=_endY;j<_startY;j++){
    //    drawPixel(i,j,0,0,getBC(i,j));
    //  }
    //updateCanvas();
  //console.log(canvasData);

    //-------------------------------
    ctx.clearRect(0,0,400,300);

    function  drawPolyline(geometry){
    for (i=0;i<geometry.x.length;i++){
      var point = U2D(geometry.x[i],geometry.y[i]);
      if(i){
        ctx.lineTo(point[0],point[1]);
      }else{
        ctx.moveTo(point[0],point[1]);
      }
    }
    }
    
    //console.log(dis);
    //const pat = ctx.createPattern(canvasData, 'no-repeat');
    ctx.beginPath();
    ctx.fillStyle = color;
    //ctx.fillStyle = pat;
    drawPolyline(dis.geometry);
    ctx.fill();
    //ctx.putImageData(canvasData,_startX,_endY);
    
    //draw neighbours
    for (i in dis.neighbours){
      ctx.fillStyle = '#afa';
      ctx.beginPath();
      drawPolyline(this.props.config.district[dis.neighbours[i]].geometry);
      ctx.stroke();      
    }
    //console.log(this.props);
    if(this.props.showLocation){
      for (i=0;i<dis.points.f.length;i++){
        if(dis.points.f[i]){
          ctx.fillStyle = 'rgb(200, 0, o0)';
          ctx.beginPath();
          var point = U2D(dis.points.x[i],dis.points.y[i]);
          ctx.arc(point[0],point[1],2,0,Math.PI*2,true);
          ctx.fill();
        }
      }
    }
  }
  render(props){
    return(
      <div style={{width:400,height:300,position:"absolute"}}>
        <canvas ref='mainCanvas' width={400} height={300} style={{position:"absolute",backgroundColor:"#afa"}}/>
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
  setCanvas: (d) => dispatch(actionCreater.setState('canvas',d)),
  setD2U: (d) => dispatch(actionCreater.setState('D2U',d)),
  setU2D: (d) => dispatch(actionCreater.setState('U2D',d)),
  setGetBC: (d) => dispatch(actionCreater.setState('getBC',d)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);