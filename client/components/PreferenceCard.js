import React from "react";
import Boxable from "./Boxable";

class PrefCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.items || []
    };
  }

  handleX = evt => {
    this.setState(prevState => {
      const newItem = evt.label;
      const options = [...prevState.options, newItem];
      return { ...prevState, options };
    });
  };

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
              handleDrop={this.props.handleDrop}
              type={this.props.type}
              handleX={this.handleX}
            />
          );
        })}
      </div>
    );
  }
}

export default PrefCard;
