import React from 'react';
import { DragDropContainer } from 'react-drag-drop-container';
import {Label} from 'semantic-ui-react'

export default class Boxable extends React.Component {
    render() {
      return (
        <div className="boxable_component" style={{display: 'inline-block'}}>
          <DragDropContainer
            targetKey="target"
            dragData={{label: this.props.label, type: this.props.type}}
            customDragElement={this.props.customDragElement}
          >
            <Label className="option" height="45">{this.props.label}</Label>
          </DragDropContainer>
        </div>
      );
    }
  }
