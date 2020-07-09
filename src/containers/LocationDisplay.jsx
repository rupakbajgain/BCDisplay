import React from "react";
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

export class LocationDisplay extends React.Component {
  constructor(props){
    super(props);
    props.setShowLocation(false);
  }
  handleChange(event, value){
    this.props.setShowLocation(value);
  }
  render(props){
    return(
      <div>
          <Tooltip title="Show borehole location">
          <Checkbox
            color="primary"
            onChange={this.handleChange.bind(this)}
          />
          </Tooltip>
      </div>
    )
  }
}


import { connect } from "react-redux";
const mapStateToProps = state => {
  return {
    showLocation: state.state.showLocation
  };
};

import actionCreater from '../redux/actionCreators.jsx';
const mapDispatchToProps = dispatch => ({
  setShowLocation: (d) => dispatch(actionCreater.setState('showLocation',d))
})

export default connect(mapStateToProps, mapDispatchToProps)(LocationDisplay);