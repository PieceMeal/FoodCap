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
            onDragStart={()=>(console.log('start'))}
            onDrag={()=>(console.log('dragging'))}
            onDragEnd={()=>(console.log('end'))}
            onDrop={(e)=>(console.log(e))}

          >
            <Label height="45">{this.props.label}</Label>
          </DragDropContainer>
        </div>
      );
    }
  }
