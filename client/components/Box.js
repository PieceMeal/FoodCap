import React from 'react';
const shortid = require('shortid')
import { DropTarget } from 'react-drag-drop-container';
import BoxItem from './BoxItem';

export default class Box extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        items: []
      };
    }

    localDropHandler = (e) => {
      let items = this.state.items.slice();
      const newItem = {
        label: e.dragData.label,
        uid: shortid.generate(),
        status: this.props.name
      }
      items.push(newItem)
      this.setState({items: items});
      e.containerElem.style.visibility="hidden"
      this.props.handleDrop(e, this.props.name)
      }

    kill = (item) => {
      console.log('ITEMS ON STATE BEFORE', this.state.items)
      let items = this.state.items.slice();
      const target = items.filter(label => label.uid !== item)
      console.log('target', target)
      this.setState({items: target});
    };

    render() {
      return (
        <div className="component_box">
            <DropTarget
              className="droptarget"
              onHit={this.localDropHandler}
              targetKey="target"
              dropData={{name: this.props.name}}
            >
              <DropTarget
                className="droptarget"
                onHit={this.localDropHandler}
                targetKey="boxItem"
                dropData={{name: this.props.name}}
              >
                <div className="box">
                  {this.state.items.map((item, index) => {
                    return (
                      <BoxItem
                        key={item.uid}
                        uid={item.uid}
                        kill={this.kill}
                        index={index}>
                        {item.label}
                        {/* <button
                          type="button"
                          onClick={() => this.kill(item, item.uid)}
                        > X
                        </button> */}
                      </BoxItem>
                    )
                  })}
                </div>
              </DropTarget>
            </DropTarget>
        </div>
      );
    }
  }
