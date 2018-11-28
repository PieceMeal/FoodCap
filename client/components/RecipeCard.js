import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Button, Icon, Popup, Container, Form, Checkbox } from 'semantic-ui-react';

const RecipeCard = props => {
	const { recipe } = props;
	return (
		<Card>
			<Link to={`/recipes/singleview/${recipe.name}`}>
				<Image
					src={recipe.image}
					style={{ height: '150px', width: '100%' }}
				/>
			</Link>
			<Card.Content>
				<Card.Header>{recipe.name}</Card.Header>
				{props.handleChangeList && (
					<Card.Meta>Total Time: {recipe.time} mins</Card.Meta>
				)}
			</Card.Content>
				<Card.Content extra>
					{props.handleChangeList && (
						<Container textAlign="right">
							{props.lists ? (
								<Popup
									on="click"
									open={props.toOpen}
									onOpen={() => props.handleOpen(recipe.name)}
									onClose={() => props.handleClose(recipe.name)}
									trigger={<Button icon="add" />}
									content={
										<Form onSubmit={props.handleSubmitList}>
											{props.lists.map(list => {
												return (
													<Form.Field key={list.uuid}>
														<Checkbox
															name={recipe.name}
															value={list.uuid}
															label={list.name}
															onChange={props.handleChangeList}
															checked={list.uuid === props.checked}
														/>
													</Form.Field>
												);
											})}

											<Button
												disabled={!props.disableSubmitButton}
												type="submit"
											>
												Submit
											</Button>
										</Form>
									}
								/>
							) : (
								<Button icon="x" />
							)}
						</Container>
					)}
					{props.toggleButtons && (
						<Button
							size="mini"
							negative
							floated="right"
							icon={<Icon name="remove circle" />}
							onClick={() => props.removeRecipe(props.recipe.name)}
						/>
					)}
				</Card.Content>
		</Card>
	);
};

export default RecipeCard;
