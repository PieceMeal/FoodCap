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
      console.log('ITEM', e.dragData)
      let items = this.state.items.slice();
      const newItem = {
        label: e.dragData.label,
        uid: shortid.generate(),
        status: this.props.name
      }
      items.push(newItem)
      this.setState({items: items});
      e.containerElem.style.visibility="hidden"
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
        return item.uid === uid
      });
      if (index !== -1) {
        items.splice(index, 1);
      }
      this.setState({items: items});
      this.props.restoreOption(item)
    };

    render() {
      return (
        <div className="component_box">
            <DropTarget
              className="droptarget"
              onHit={this.handleDrop}
              targetKey="target"
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
                    console.log('ITEM', item)
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
