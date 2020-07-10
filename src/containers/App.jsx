import React from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import InputOverlay from './InputOverlay.jsx';
import Canvas from './Canvas.jsx';
/*
import MyLocationIcon from '@material-ui/icons/MyLocation';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import BlurCircularIcon from '@material-ui/icons/BlurCircular';
*/

export class App extends React.Component {
  componentDidMount(){
    const el = this.refs.BCElement;
    this.props.setBCElement(el);
  }
  render(){    
    return (
      <React.Fragment>
        <CssBaseline />
        <Paper style={{width:410, border: '5px solid blue', backgroundColor:'blue',color:'#fff'}}>
          <div>
            <span style={{width:"50%", display:'inline-block'}}>
              Latitude: <span>{(this.props.latitude||0).toFixed(4)}</span>
            </span>
            <span style={{width:"50%", display:'inline-block'}}>
              Longitude: <span>{(this.props.longitude||0).toFixed(4)}</span>
            </span>
          </div>
          <div style={{height:300, margin:0, padding:0}} >
            <InputOverlay/>
            <Canvas/>
          </div>
          <div>
            <span style={{width:"50%", display:'inline-block'}}>
              Bearing Capacity: <span ref='BCElement'>{(this.props.BC||0).toFixed(2)}</span>kPa
            </span>
            <span style={{width:"50%", display:'inline-block'}}>
              Depth: <span>{this.props.depth}</span>
            </span>
          </div>
        </Paper>
      </React.Fragment>
    );
  }
};

import { connect } from "react-redux";
const mapStateToProps = state => {
  return {
    depth: state.state.depth,
    latitude: state.state.latitude,
    longitude: state.state.longitude,
    BC: state.state.BC
  };
};

import actionCreater from '../redux/actionCreators.jsx';
const mapDispatchToProps = dispatch => ({
  setBCElement: (d) => dispatch(actionCreater.setState('BCElement',d))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);