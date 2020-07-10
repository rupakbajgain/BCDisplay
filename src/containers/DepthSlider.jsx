import React from "react";
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

function valuetext(x){
  return `${a2r(x)} m`;
}

function a2r(x){
  return (60-x)/10;
}

function r2a(x){
  return 60 - x*10;
}

const marks = [
  {
    value: r2a(4.5),
    label: valuetext(r2a(4.5)),
  },
  {
    value: r2a(3),
    label: valuetext(r2a(3)),
  },
  {
    value: r2a(1.5),
    label: valuetext(r2a(1.5)),
  }
]
 
export class DepthSlider extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: r2a(1.5)};
    props.setDepth(1.5);
  }
  handleChange(event, value){
    this.setState({value: value});
    this.props.setDepth(a2r(value));
  }
  render(){
   return(
    <div style={{height:170, paddingLeft:10}}>
      <Tooltip title="Depth">
        <Slider
          orientation="vertical"
          defaultValue={r2a(1.5)}
          min={r2a(4.5)}
          max={r2a(1.5)}
          aria-labelledby="vertical-slider"
          track={false}
          marks={marks}
          onChangeCommitted={this.handleChange.bind(this)}
        />
      </Tooltip>
    </div>
    );
  }
}

import { connect } from "react-redux";
const mapStateToProps = state => {
  return {
    depth: state.state.currentDepth
  };
};

import actionCreater from '../redux/actionCreators.jsx';
const mapDispatchToProps = dispatch => ({
  setDepth: (d) => dispatch(actionCreater.setState('depth',d))
})
export default connect(mapStateToProps, mapDispatchToProps)(DepthSlider);