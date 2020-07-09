import React from "react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';

export class MethodSelect extends React.Component {
  constructor(props){
    super(props);
    var key=props.config.methods[props.config.methods.length-1];
    this.props.setMethod(key);
  }

  handleChange(event, value){
    this.props.setMethod(value.props.children);
  }
  render(){
    var keys = this.props.config.methods;    
    return(
      <div>
        <Tooltip title="Method">
          <Select
            value={this.props.method || keys[keys.length-1]}
            onChange={this.handleChange.bind(this)}
          >{}
            {keys.map(i=>
                <MenuItem value={i} key={i}>{i}</MenuItem>
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
    method: state.state.method,
    config: state.config,
  };
};

import actionCreater from '../redux/actionCreators.jsx';
const mapDispatchToProps = dispatch => ({
  setMethod: (d) => dispatch(actionCreater.setState('method',d))
})
export default connect(mapStateToProps, mapDispatchToProps)(MethodSelect);