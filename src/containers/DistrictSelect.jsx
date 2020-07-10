import React from "react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';

export class LocationDisplay extends React.Component {
  constructor(props){
    super(props);
    var key;
    for (var i in props.config.district){
        key=i;
        break;
    }
    //console.log(keys);
    props.setDistrict(key);
  }

  handleChange(event, value){
    this.props.setDistrict(value.props.children);
  }
  render(){
    var keys = [];
    for (var i in this.props.config.district){
      //if(this.props.config.district[i].hasOwnProperty('neighbours'))
        keys.push({key:keys.length, value:i});
    }
    
    return(
      <div>
        <Tooltip title="District">
          <Select
            value={this.props.district || keys[0].value}
            onChange={this.handleChange.bind(this)}
          >{}
            {keys.map(i=>
                <MenuItem value={i.value} key={i.key}>{i.value}</MenuItem>
                )}
          </Select>
        </Tooltip>
      </div>
    )
  }
}

import { connect } from "react-redux";
const mapStateToProps = state => {
  return {
    district: state.state.district,
    config: state.config,
  };
};

import actionCreater from '../redux/actionCreators.jsx';
const mapDispatchToProps = dispatch => ({
  setDistrict: (d) => dispatch(actionCreater.setState('district',d))
})
export default connect(mapStateToProps, mapDispatchToProps)(LocationDisplay);