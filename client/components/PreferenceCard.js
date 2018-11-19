import React from 'react'
import Boxable from "./Boxable";
import Box from "./Box";

const PrefCard = props => {
  return (
    <div>
      <div className="headers">
        <h3>Favorite {props.name}:</h3>
        <br />
      </div>
      <div className="boxes">
        <div className="options">
          {props.items.map(item => {
          return (
            <Boxable targetKey={props.name} label={item} />
          )
          })}
        </div>
        <Box targetKey={props.name} />
      </div>
    </div>
  )
}

export default PrefCard
