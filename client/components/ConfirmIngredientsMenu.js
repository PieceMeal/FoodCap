import React from 'react';

import { Modal, Grid, Button, Icon } from 'semantic-ui-react';

const ConfirmIngredientsMenu = props => {
	return (
		<React.Fragment>
			<Modal.Header>Confirm Your Updates</Modal.Header>
			<Modal.Content>
				<Grid columns="five" divided>
					<Grid.Row>
						<Grid.Column>Ingredient</Grid.Column>
						<Grid.Column>Quantity</Grid.Column>
						<Grid.Column>Notes</Grid.Column>
						<Grid.Column>Accept</Grid.Column>
						<Grid.Column>Reject</Grid.Column>
					</Grid.Row>
					{props.items.map(item => {
						return (
							<Grid.Row key={item.name}>
								<Grid.Column>{item.name}</Grid.Column>
								<Grid.Column>
									{item.quantity} {item.type}
								</Grid.Column>
								<Grid.Column>{item.note}</Grid.Column>
								<Grid.Column>
									<Button
										size="mini"
										icon={<Icon name="check circle" />}
										onClick={() => console.log('accept ' + item.name)}
									/>
								</Grid.Column>
								<Grid.Column>
									<Button
										size="mini"
										icon={<Icon name="cancel" />}
										onClick={() => props.reject(item.name)}
									/>
								</Grid.Column>
							</Grid.Row>
						);
					})}
				</Grid>
			</Modal.Content>
		</React.Fragment>
	);
};

export default ConfirmIngredientsMenu;
