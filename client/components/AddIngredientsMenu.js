import React from 'react';

import { Link } from 'react-router-dom';
import { Card, Image, Button, Icon, Modal, Header } from 'semantic-ui-react';

//dump component
//pass a recipe object as props
//toggle buttons
const AddIngredientsMenu = props => {
	console.log('test');
	return (
		<React.Fragment>
			<Modal.Header>Confirm Your Updates</Modal.Header>
			<Modal.Content>
				{props.items.map(item => {
					return <div key={item.name}> {item.name}</div>;
				})}
			</Modal.Content>
		</React.Fragment>
	);
};

export default AddIngredientsMenu;
