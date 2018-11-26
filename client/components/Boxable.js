import React from 'react';
import { DragDropContainer } from 'react-drag-drop-container';
import {Label} from 'semantic-ui-react'

export default class Boxable extends React.Component {
    render() {
      return (
        <div className="boxable_component" style={{display: 'inline-block'}}>
          <DragDropContainer
            targetKey={this.props.targetKey}
            dragData={{label: this.props.label}}
            customDragElement={this.props.customDragElement}
            onDrop={(e) => (this.props.handleDrop(e.dragData.label, this.props.type))}
          >
            <Label className="option" height="45">{this.props.label}</Label>
          </DragDropContainer>
        </div>
      );
    }
  }
