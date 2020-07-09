import React from "react";
import DepthSlider from './DepthSlider.jsx';
import LocationDisplay from './LocationDisplay.jsx';
import DistrictSelect from './DistrictSelect.jsx';
import MethodSelect from './MethodSelect.jsx';
import GetAppIcon from '@material-ui/icons/GetApp';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';

export class InputOverlay extends React.Component {
  constructor(props){
    super(props);
    this.state={guide: null,bc:0};
  }
  componentDidMount(){
    const guide = this.refs.main;
    this.setState({guide});
  }
  downloadCanvas(){
    window.location.assign(this.props.canvas.toDataURL());
  }
  copyCapacity(){
    var textArea = document.createElement('textarea');
    textArea.value=this.state.bc;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }
  mouseMove(event){
    var _x=event.clientX-this.state.guide.offsetLeft;
    var _y=event.clientY-this.state.guide.offsetTop;
    const ll = this.props.D2U(_x, _y);
    this.props.setLatitude(ll[0]);
    this.props.setLongitude(ll[1]);
    this.props.setBC(this.props.getBC(ll[0],ll[1]));
  }
  mouseClick(event){
    this.mouseMove(event);
    this.setState({bc:this.props.BCElement.textContent});
  }
  
  render(){
    return(
      <div ref='main' onClick={this.mouseClick.bind(this)} onMouseMove={this.mouseMove.bind(this)} style={{width:400,height:300,position:"absolute",cursor: 'crosshair'}}>
        <div style={{position:"absolute",top:15}}>
          <DepthSlider/>
        </div>
        <div style={{position:"absolute",top:0, right:0}}>
          <LocationDisplay/>
        </div>
        <div style={{position:"absolute",bottom:0, right:0}}>
          <DistrictSelect/>
        </div>
        <div style={{position:"absolute",bottom:0, left:3}}>
          <MethodSelect/>
        </div>
        <div style={{color:'#faa', paddingLeft:3,position:"absolute",bottom:6, left:125}}> Use at your own risk</div>
        <div style={{position:"absolute",bottom:45, top: 45,right:0}}>
          <Tooltip title="Download canvas">
            <IconButton onClick={this.downloadCanvas.bind(this)}>
              <GetAppIcon/>
            </IconButton>
          </Tooltip><br/>
          <Tooltip title="Copy bearing capacity">
            <IconButton onClick={this.copyCapacity.bind(this)}>
              <FileCopyIcon/>
            </IconButton>
          </Tooltip>
        </div>
      </div>
    )
  }
}
// Download icon

import { connect } from "react-redux";
const mapStateToProps = state => {
  return {
    canvas: state.state.canvas,
    BCElement: state.state.BCElement,
    D2U: state.state.D2U,
    getBC: state.state.getBC,
  };
};

import actionCreater from '../redux/actionCreators.jsx';
const mapDispatchToProps = dispatch => ({
  setLatitude: (d) => dispatch(actionCreater.setState('latitude',d)),
  setLongitude: (d) => dispatch(actionCreater.setState('longitude',d)),
  setBC: (d) => dispatch(actionCreater.setState('BC',d)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InputOverlay);