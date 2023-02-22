import {React, Component} from "react";

class ChildComponent extends Component {
    render() {
      const { data } = this.props;
      return (
        <div>
          <p>{data}</p>
        </div>
      )
    }
  }
  export default ChildComponent;