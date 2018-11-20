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

    handleDrop = (e) => {
      let items = this.state.items.slice();
      items.push({label: e.dragData.label, uid: shortid.generate()});
      this.setState({items: items});
      e.containerElem.style.visibility = "hidden";
    };

    swap = (fromIndex, toIndex, dragData) => {
      let items = this.state.items.slice();
      const item = {label: dragData.label, uid: shortid.generate()};
      items.splice(toIndex, 0, item);
      this.setState({items: items});
    };

    kill = (item, uid) => {
      this.props.handleX(item)
      let items = this.state.items.slice();
      const index = items.findIndex((item) => {
        return item.uid == uid
      });
      if (index !== -1) {
        items.splice(index, 1);
      }
      this.setState({items: items});
    };

    render() {

      return (
        <div className="component_box">
            <DropTarget
              className="droptarget"
              onHit={this.handleDrop}
              targetKey={this.props.targetKey}
              dropData={{name: this.props.name}}
            >
              <DropTarget
                className="droptarget"
                onHit={this.handleDrop}
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
                        index={index}
                        swap={this.swap}>
                        {item.label}
                        <button
                          type="button"
                          onClick={() => this.kill(item, item.uid)}
                        > X
                        </button>
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
