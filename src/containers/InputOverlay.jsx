import React from "react";
import DepthSlider from './DepthSlider.jsx';
import LocationDisplay from './LocationDisplay.jsx';
import DistrictSelect from './DistrictSelect.jsx';
import MethodSelect from './MethodSelect.jsx';
//import GetAppIcon from '@material-ui/icons/GetApp';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';

export class InputOverlay extends React.Component {
  constructor(props){
    super(props);
    this.state={guide: null};
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
    textArea.value=this.props.clipboard;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }  
  render(){
    return(
      <div ref='main' style={{width:400,height:300,position:"absolute"}}>
        <div style={{position:"absolute",top:90, zIndex:1100}}>
          <DepthSlider/>
        </div>
        <div style={{position:"absolute",top:0, right:0, zIndex:1100}}>
          <LocationDisplay/>
        </div>
        <div style={{position:"absolute",bottom:0, right:0, zIndex:1100}}>
          <DistrictSelect/>
        </div>
        <div style={{position:"absolute",bottom:0, left:3, zIndex:1100}}>
          <MethodSelect/>
        </div>
        <div style={{color:'#faa', paddingLeft:3,position:"absolute",bottom:6, left:125, zIndex:1100}}> Use at your own risk</div>
        <div style={{position:"absolute",bottom:45, top: 45,right:0, zIndex:1100}}>
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
    clipboard: state.state.clipboard,
  };
};

import actionCreater from '../redux/actionCreators.jsx';
const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(InputOverlay);