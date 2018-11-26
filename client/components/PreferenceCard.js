import React from "react";
import Boxable from "./Boxable";
import { Header } from "semantic-ui-react"

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
              targetKey={this.props.name}
              label={item}
              handleDrop={this.props.handleDrop}
              type={this.props.type}
            />
          );
        })}
      </div>
    );
  }
}

export default PrefCard;
