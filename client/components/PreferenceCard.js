import React from "react";
import Boxable from "./Boxable";

class PrefCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.items || []
    };
  }

  render() {
    return (
      <div className="options">
        <br />
        {this.state.options.map(item => {
          return (
            <Boxable
              key={this.props.items.indexOf(item)}
              targetKey="target"
              label={item}
              type={this.props.type}
            />
          );
        })}
      </div>
    );
  }
}

export default PrefCard;
