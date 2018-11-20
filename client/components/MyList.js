import React, { Component } from 'react';
import Navbar from './navbar';
import { Link } from 'react-router-dom';
import {
	Button,
	Icon,
	Header,
	Divider,
	Input,
	Popup,
	Form,
	Card,
	Image,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
	setListThunk,
	removeListItemThunk,
	updateListQuantityThunk,
	addItemToListThunk,
	addNoteThunk,
} from '../store/list';
import {
	setIngredientsThunk,
	createIngredientThunk,
} from '../store/ingredients';

import { RecipeCard } from './';
const style = {
	h3: {
		padding: '2em 0em',
	},
	listButtons: {
		float: 'right',
		backgroundColor: '#E0E0E0',
		marginLeft: '1vw',
	},
	wholeTray: {
		backgroundColor: 'pink',
		marginLeft: '5vw',
		marginRight: '5vw',
		padding: '12px',
		border: '2px solid black',
		borderRadius: '15px',
	},
};

class MyList extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			ingredients: [],
			disableForm: false,
			ingredientsOptions: [],
			addItemName: '',
			addItemType: '',
			addItemQuantity: '',
			addItemNote: '',
			openPopup: false,
			itemNote: '',
			itemNotePopup: [],
		};
	}
	async componentDidMount() {
		const { id } = this.props.match.params;

		await this.props.setList(id);
		this.populateFields();
		this.setState({ loading: false });
	}
	//handle state for form
	handleChange = evt => {
		const newState = { ...this.state };
		newState.ingredients[evt.target.name] = evt.target.value;
		this.setState(newState);
	};

	//dispatch remove item from list thunk
	handleRemoveItem = async (uuid, ingredient) => {
		this.setState({ disableForm: true });
		await this.props.removeListItem(uuid, ingredient);
		this.setState({ disableForm: false });
	};

	//dispatch update list thunk
	handleUpdate = async uuid => {
		const updatedItems = [];
		this.props.list.ingredients.forEach(ingredient => {
			if (+ingredient.quantity !== +this.state.ingredients[ingredient.name]) {
				updatedItems.push({
					name: ingredient.name,
					quantity: this.state.ingredients[ingredient.name],
					type: ingredient.type,
					note: ingredient.note,
				});
			}
		});
		if (updatedItems.length > 0) {
			this.setState({ disableForm: true });

			await this.props.updateItems(uuid, updatedItems);
			this.setState({ disableForm: false });
		}
	};

	handleFetchIngredients = async () => {
		this.setState({ disableForm: true });

		await this.props.setIngredients();
		const ingredientsOptions = this.props.ingredients.map((ingredient, i) => {
			return { key: i, value: ingredient, text: ingredient };
		});
		this.setState({ disableForm: false, ingredientsOptions, openPopup: true });
	};

	handleCreate = async (evt, { value }) => {
		console.log('creating new ingredient');
		this.setState({ disableForm: true });
		await this.props.createIngredient(value);
		const ingredientsOptions = this.props.ingredients.map((ingredient, i) => {
			return { key: i, value: ingredient, text: ingredient };
		});
		console.log('made new ingredients');

		this.setState({
			disableForm: false,
			ingredientsOptions,
			addItemName: value,
		});
	};

	ingredientSelect = (evt, { value }) => {
		console.log('set to new value ', value);
		this.setState({ addItemName: value });
	};

	handleAddChange = (evt, { name, value }) => {
		this.setState({ [name]: value });
	};

	handleClosePopup = () => {
		this.setState({ openPopup: false });
	};

	addItemButton = async () => {
		const { id } = this.props.match.params;
		const {
			addItemName,
			addItemQuantity,
			addItemType,
			addItemNote,
		} = this.state;
		if (this.state.addItemName.length > 0) {
			if (+this.state.addItemQuantity > 0) {
				await this.props.addItem(
					id,
					addItemName,
					addItemQuantity,
					addItemType,
					addItemNote
				);
				this.setState({
					openPopup: false,
					addItemName: '',
					addItemType: '',
					addItemQuantity: '',
					addItemNote: '',
				});
				this.populateFields();
			}
		}
	};

	toggleNotePopup = i => {
		const pops = [...this.state.itemNotePopup];
		pops[i] = !pops[i];
		const itemNote = pops[i] ? this.props.list.ingredients[i].note || '' : '';
		this.setState({ itemNotePopup: pops, itemNote });
	};

	saveNote = async (fieldId, ingredient) => {
		const { id } = this.props.match.params;
		const newIngreds = [...this.state.ingredients];

		await this.props.addNote(id, ingredient, this.state.itemNote);
		this.toggleNotePopup(fieldId);

		console.log(id, fieldId, ingredient, this.state.itemNote);
	};
	populateFields = () => {
		const newState = { ...this.state };
		this.props.list.ingredients.forEach((ingredient, i) => {
			newState.ingredients[ingredient.name] = ingredient.quantity;
			newState.itemNotePopup[i] = false;
		});
		this.setState(newState);
	};
	render() {
		//dont display until loaded
		if (this.state.loading === true) {
			return <div />;
		}

		const list = this.props.list;
		const { ingredients, recipes } = list;
		console.log(recipes);
		if (ingredients) {
			return (
				<React.Fragment>
					<Navbar />

					<div style={style.wholeTray}>
						<Header
							as="h3"
							content="Your Tray"
							style={style.h3}
							textAlign="center"
						/>
						<Card.Group centered itemsPerRow={4}>
							{recipes.map(recipe => {
								return (
									<RecipeCard key={recipe.name} recipe={recipe} />
									// <Card key={recipe.name}>
									// 	<Link to={`/recipes/singleview/${recipe.name}`}>
									// 		<Image src={recipe.image} />
									// 	</Link>

									// 	<Card.Content>
									// 		<Card.Header>{recipe.name}</Card.Header>
									// 	</Card.Content>
									// </Card>
								);
							})}
						</Card.Group>
						<Divider />

						<table className="ui inverted olive table">
							<thead>
								<tr>
									<th>Item</th>
									<th>Amount</th>
									<th>Notes</th>
									<th />
								</tr>
							</thead>
							<tbody>
								{ingredients.length
									? ingredients.map((ingredient, i) => {
											return (
												<tr key={i}>
													<td>
														<b>{ingredient.name}</b>
													</td>
													<td>
														<Input
															name={ingredient.name}
															label={ingredient.type || false}
															labelPosition="right corner"
															value={this.state.ingredients[ingredient.name]}
															onChange={this.handleChange}
															disabled={this.state.disableForm}
														/>
													</td>
													<td>{ingredient.note ? ingredient.note : null}</td>
													<td>
														<Button
															size="mini"
															negative
															floated="right"
															icon={<Icon name="remove circle" />}
															onClick={() =>
																this.handleRemoveItem(
																	list.uuid,
																	ingredient.name
																)
															}
														/>
														<Popup
															on="click"
															onOpen={() => this.toggleNotePopup(i)}
															onClose={() => this.toggleNotePopup(i)}
															open={this.state.itemNotePopup[i]}
															trigger={
																<Button
																	size="mini"
																	floated="right"
																	positive
																	icon={<Icon name="sticky note outline" />}
																/>
															}
															style={{ width: '300px' }}
														>
															<Popup.Content>
																<Form>
																	<Input
																		placeholder="note"
																		width="1"
																		onChange={this.handleAddChange}
																		value={this.state.itemNote}
																		name="itemNote"
																	/>
																	<Button
																		size="mini"
																		positive
																		icon={<Icon name="save" />}
																		onClick={() =>
																			this.saveNote(i, ingredient.name)
																		}
																	/>
																</Form>
															</Popup.Content>
														</Popup>
													</td>
												</tr>
											);
									  })
									: null}
								<tr>
									<td>
										<Popup
											trigger={<Button icon="add" />}
											on="click"
											style={{ width: '300px' }}
											onOpen={this.handleFetchIngredients}
											onClose={this.handleClosePopup}
											open={this.state.openPopup}
										>
											<Popup.Content>
												<Form>
													<Form.Group>
														<Form.Dropdown
															search
															selection
															allowAdditions
															disabled={this.state.disableForm}
															placeholder="Choose Ingredient"
															value={this.state.addItemName}
															options={this.state.ingredientsOptions}
															onAddItem={this.handleCreate}
															onChange={this.ingredientSelect}
														/>
													</Form.Group>
													<Form.Group>
														<Form.Field>
															<label> #</label>
															<Input
																placeholder="#"
																width="1"
																onChange={this.handleAddChange}
																value={this.state.addItemQuantity}
																name="addItemQuantity"
															/>
														</Form.Field>
														<Form.Field>
															<label> Type</label>
															<Input
																placeholder="type"
																width="6"
																onChange={this.handleAddChange}
																value={this.state.addItemType}
																name="addItemType"
															/>
														</Form.Field>
													</Form.Group>
													<Form.Group>
														<Form.Field>
															<label> Note</label>
															<Input
																placeholder="type"
																width="6"
																onChange={this.handleAddChange}
																value={this.state.addItemNote}
																name="addItemNote"
															/>
														</Form.Field>
													</Form.Group>
													<Form.Group>
														<Button type="button" onClick={this.addItemButton}>
															Submit
														</Button>
													</Form.Group>
												</Form>
											</Popup.Content>
										</Popup>
									</td>
								</tr>
							</tbody>
						</table>

						<Divider />
						<span>
							<Button animated style={{ backgroundColor: 'red' }}>
								<Button.Content visible>
									<i aria-hidden="true" className="trash alternate icon" />
								</Button.Content>
								<Button.Content hidden>Delete</Button.Content>
							</Button>
							<Button
								animated
								style={{ backgroundColor: 'green' }}
								onClick={() => this.handleUpdate(list.uuid)}
							>
								<Button.Content visible>
									<i aria-hidden="true" className="trash alternate icon" />
								</Button.Content>
								<Button.Content hidden>Update </Button.Content>
							</Button>
						</span>
					</div>
				</React.Fragment>
			);
		} else {
			return <div>LOADING</div>;
		}
	}
}

const mapStateToProps = state => {
	const { list, ingredients } = state;
	return {
		list,
		ingredients,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setList: id => dispatch(setListThunk(id)),
		removeListItem: (uuid, ingredient) =>
			dispatch(removeListItemThunk(uuid, ingredient)),
		updateItems: (uuid, updatedItems) =>
			dispatch(updateListQuantityThunk(uuid, updatedItems)),
		setIngredients: () => dispatch(setIngredientsThunk()),
		createIngredient: name => dispatch(createIngredientThunk(name)),
		addItem: (uuid, ingredient, quantity, type, note) =>
			dispatch(addItemToListThunk(uuid, ingredient, quantity, type, note)),
		addNote: (uuid, ingredient, note) =>
			dispatch(addNoteThunk(uuid, ingredient, note)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MyList);
