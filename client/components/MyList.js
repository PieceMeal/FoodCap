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
	Modal,
	Image,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
	setListThunk,
	removeListItemThunk,
	updateListQuantityThunk,
	addItemToListThunk,
	addNoteThunk,
	removeRecipeThunk,
} from '../store/list';
import {
	setIngredientsThunk,
	createIngredientThunk,
} from '../store/ingredients';

import { getIngredientsThunk } from '../store/singlerecipe';

import {
	RecipeCard,
	ConfirmIngredientsMenu,
	ItemsConflictModal,
	RemoveRecipeIngredientsMenu,
	IngredientRow,
} from './';
import history from '../history';

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
		backgroundColor: 'white',
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
			updatedItems: [],
			recipeItems: [],
			showConfirmPopup: false,
			showConflictModal: false,
		};
	}
	async componentDidMount() {
		const { id } = this.props.match.params;

		await this.props.setList(id);
		this.populateFields();
		this.setState({ loading: false });

		this.itemsHash = [];
		this.flaggedItems = [];
	}

	async componentDidUpdate(prevProps) {
		this.itemsHash = [];

		if (prevProps.list !== this.props.list) {
			this.props.list.ingredients.forEach(ingred => {
				if (!this.itemsHash[ingred.name]) {
					this.itemsHash[ingred.name] = [];
				}
				this.itemsHash[ingred.name].push(ingred);
			});
			this.flaggedItems = Object.keys(this.itemsHash)
				.filter(index => this.itemsHash[index].length > 1)
				.map(item => this.itemsHash[item]);

			if (this.flaggedItems.length > 0) {
				console.log(
					'there are this many conflicts: ' + this.flaggedItems.length
				);
				console.log('first in line ' + this.flaggedItems[0][0].name);
				await this.setState({ showConflictModal: true });
			} else {
				await this.setState({ showConflictModal: false });
				this.populateFields();
			}
		}
	}
	//handle function for controlling form inputs for quantity
	handleChange = evt => {
		const newState = { ...this.state };
		newState.ingredients[evt.target.name] = evt.target.value;
		this.setState(newState);
	};

	//handle function for
	//dispatch remove item from list thunk
	handleRemoveItem = async (uuid, ingredient) => {
		this.setState({ disableForm: true });
		await this.props.removeListItem(uuid, ingredient);
		this.setState({ disableForm: false });
	};

	//checks all ingredients if they are updated or not
	//creates a list of updated ingredients and stores in this.updatedItems
	//changes state to open a confirm modal if there are items to be
	//updated
	handleUpdate = uuid => {
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
			this.setState({
				showConfirmPopup: true,
				disableForm: true,
				updatedItems,
			});
			// 	await this.props.updateItems(uuid, updatedItems);
			// 	this.setState({ disableForm: false });
		}
	};

	//grabs all ingredients for add item dropdown
	handleFetchIngredients = async () => {
		this.setState({ disableForm: true });

		await this.props.setIngredients();
		const ingredientsOptions = this.props.ingredients.map((ingredient, i) => {
			return { key: i, value: ingredient, text: ingredient };
		});
		this.setState({ disableForm: false, ingredientsOptions, openPopup: true });
	};

	//create an ingredient not in the ingredients list
	handleCreate = async (evt, { value }) => {
		this.setState({ disableForm: true });
		await this.props.createIngredient(value);
		const ingredientsOptions = this.props.ingredients.map((ingredient, i) => {
			return { key: i, value: ingredient, text: ingredient };
		});

		this.setState({
			disableForm: false,
			ingredientsOptions,
			addItemName: value,
		});
	};

	//selected an ingredient on add ingredient dropdown
	ingredientSelect = (evt, { value }) => {
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
	};

	//when a user clicks on the remove recipe button they should get prompted
	//to remove each item on their list after removing the recipe
	handleRemoveRecipe = async recipeName => {
		//populate 'singlerecipe props with information to
		//use for confirmation modal
		await this.props.getIngredients(recipeName);
		await this.props.removeRecipe(this.props.list.uuid, recipeName);
		//recipeItems
		const test = { ...this.state };
		const currentListKeys = Object.keys(test.ingredients);
		const ingredients = this.props.singlerecipe.ingredients.filter(i =>
			currentListKeys.includes(i));
		//ingredients = all ingredients in recipe that are still on list
		console.log(ingredients);

		// const removeIngredients = Object.keys(test.ingredients).filter(i =>
		// 	this.props.singlerecipe.ingredients.includes(i));

		let promptItems = [];

		ingredients.forEach(i => {
			promptItems.push({ name: i, quantity: this.state.ingredients[i] });
		});
		//console.log(promptItems);

		this.setState({
			recipeItems: promptItems,
			showConfirmPopup: true,
			disableForm: true,
		});
	};

	//when a user tries to update their items a confirmation menu pops up
	//this is passed to ConfirmIngredientsMenu for rejecting update
	handleReject = (itemName, type = 'update') => {
		const newState = { ...this.state };
		if (type === 'update') {
			const updatedItems = this.state.updatedItems.filter(
				item => item.name !== itemName
			);
			newState.updatedItems = updatedItems;
			const oldItemQuantity = this.props.list.ingredients.filter(
				i => i.name === itemName
			)[0].quantity;

			newState.ingredients[itemName] = oldItemQuantity;

			if (updatedItems.length === 0) {
				newState.showConfirmPopup = false;
				newState.disableForm = false;
				newState.updatedItems = [];
			}
		} else if (type === 'recipe') {
			newState.recipeItems = newState.recipeItems.filter(
				i => i.name !== itemName
			);
			if (newState.recipeItems.length === 0) {
				newState.showConfirmPopup = false;
				newState.disableForm = false;
				newState.recipeItems = [];
			}
		}
		this.setState(newState);
	};

	handleAccept = async (itemName, type = 'update') => {
		const newState = { ...this.state };
		if (type === 'update') {
			const updatedItems = this.state.updatedItems.filter(
				item => item.name !== itemName
			);
			newState.updatedItems = updatedItems;

			if (updatedItems.length === 0) {
				newState.showConfirmPopup = false;
				newState.disableForm = false;
				newState.updatedItems = [];
			}

			const updatedItem = this.state.updatedItems.filter(
				item => item.name === itemName
			);

			await this.props.updateItems(this.props.list.uuid, updatedItem);
		} else if (type === 'recipe') {
			//remove item from menu
			newState.recipeItems = newState.recipeItems.filter(
				i => i.name !== itemName
			);
			//dispatch remove thunk to remove item
			await this.handleRemoveItem(this.props.list.uuid, itemName);
			if (newState.recipeItems.length === 0) {
				newState.showConfirmPopup = false;
				newState.disableForm = false;
				newState.recipeItems = [];
			}
		}
		this.setState(newState);
	};
	populateFields = () => {
		const newState = { ...this.state };
		const ingredList = this.props.list.ingredients;
		Object.keys(ingredList).forEach((ingredient, i) => {
			newState.ingredients[ingredList[ingredient].name] =
				ingredList[ingredient].quantity;
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
		if (ingredients) {
			return (
				<React.Fragment>
					<Modal
						closeOnDimmerClick={false}
						open={this.state.showConflictModal}
						onClose={() => console.log('closing stuff')}
					>
						{this.flaggedItems.length > 0 && (
							<ItemsConflictModal
								item={this.flaggedItems[0]}
								uuid={list.uuid}
							/>
						)}
					</Modal>
					<Modal
						open={this.state.showConfirmPopup}
						onClose={() =>
							this.setState({ showConfirmPopup: false, disableForm: false })
						}
					>
						{this.state.updatedItems.length > 0 && (
							<ConfirmIngredientsMenu
								items={this.state.updatedItems}
								reject={this.handleReject}
								accept={this.handleAccept}
							/>
						)}

						{this.state.recipeItems.length > 0 && (
							<RemoveRecipeIngredientsMenu
								items={this.state.recipeItems}
								reject={this.handleReject}
								accept={this.handleAccept}
							/>
						)}
					</Modal>

					{/* <div style={style.wholeTray}> */}
					<div>
						<Header
							as="h3"
							content="Your Tray"
							// style={style.h3}
							textAlign="center"
						/>
						<Card.Group centered itemsPerRow={4}>
							{recipes.map(recipe => {
								return (
									<RecipeCard
										key={recipe.name}
										recipe={recipe}
										toggleButtons="true"
										removeRecipe={this.handleRemoveRecipe}
									/>
								);
							})}
						</Card.Group>
						<Divider />

						<table className="ui inverted table">
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
													<td>
														<b>{ingredient.note ? ingredient.note : null}</b>
													</td>
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
							<Button
								animated
								style={{ backgroundColor: 'green' }}
								onClick={() => this.handleUpdate(list.uuid)}
							>
								<Button.Content visible>
									<i aria-hidden="true" className="check alternate icon" />
								</Button.Content>
								<Button.Content hidden>Update </Button.Content>
							</Button>

							<Button
								animated
								floated="right"
								onClick={() => history.push(`/shopping/${list.uuid}`)}
							>
								<Button.Content visible>
									<i aria-hidden="true" className="list icon" />
								</Button.Content>
								<Button.Content hidden>List </Button.Content>
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
	const { list, ingredients, singlerecipe } = state;
	return {
		list,
		ingredients,
		singlerecipe,
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
		getIngredients: name => dispatch(getIngredientsThunk(name)),
		removeRecipe: (uuid, recipe) => dispatch(removeRecipeThunk(uuid, recipe)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MyList);
