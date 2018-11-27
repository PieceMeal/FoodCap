import React from 'react';
import { DragDropContainer } from 'react-drag-drop-container';

export default class BoxItem extends React.Component {
    // the things that appear in the boxes
    constructor(props) {
      super(props);
    }

    deleteMe = () => {
      this.props.kill(this.props.uid);
    };

    render() {
      return (
        <div className="box_item_component">
          <DragDropContainer
              targetKey="boxItem"
              dragData={{label: this.props.children, index: this.props.index}}
              onDrop={this.deleteMe}
              dragHandleClassName="grabber"
            >
                <div className="outer">
                  <div className="item">
                    <span className="grabber">&#8759;</span>
                    {this.props.children}
                    <button
                          type="button"
                          onClick={() => this.props.handleX(this.props.uid)}
                        > X
                    </button>
                  </div>
                </div>
          </DragDropContainer>
        </div>
      );
    }
  }
