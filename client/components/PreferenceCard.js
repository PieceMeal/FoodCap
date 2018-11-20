import React from 'react'
import Boxable from "./Boxable";
import Box from "./Box";

class PrefCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: this.props.items || []
    }
  }

  handleX = evt => {
    this.setState((prevState) => {
      const newItem = evt.label
      const options = [...prevState.options, newItem];
      return {...prevState, options }
    })
  }

  render() {
    return (
      <div className="boxes">
        <h3>Favorite {this.props.name}:</h3>
          <div className="options">
            {this.state.options.map(item => {
            return (
              <Boxable
                targetKey={this.props.name}
                label={item}
                handleDrop={this.props.handleDrop}
                type={this.props.type}
              />
            )
            })}
          </div>
          <Box targetKey={this.props.name} handleX={this.handleX} />
      </div>
    )
  }
}

export default PrefCard
