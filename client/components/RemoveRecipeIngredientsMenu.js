import React from 'react';

import { Modal, Grid, Button, Icon } from 'semantic-ui-react';

const RemoveRecipeIngredientsMenu = props => {
	return (
		<React.Fragment>
			<Modal.Header>
				Do you want to remove the following ingredients?
			</Modal.Header>
			<Modal.Content className="deletemodal">
				<Grid columns="five" divided>
					<Grid.Row>
						<Grid.Column>Ingredient</Grid.Column>

						<Grid.Column>Yes: Remove</Grid.Column>
						<Grid.Column>No: Keep</Grid.Column>
					</Grid.Row>
					{props.items.map(item => {
						return (
							<Grid.Row key={item.name}>
								<Grid.Column>{item.name}</Grid.Column>
								<Grid.Column>
									<Button
										size="mini"
										icon={<Icon name="check circle" />}
										onClick={() => props.accept(item.name, 'recipe')}
									/>
								</Grid.Column>
								<Grid.Column>
									<Button
										size="mini"
										icon={<Icon name="cancel" />}
										onClick={() => props.reject(item.name, 'recipe')}
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

export default RemoveRecipeIngredientsMenu;
