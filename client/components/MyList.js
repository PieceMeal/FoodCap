import React, { Component } from 'react';

import {
	Button,
	Grid,
	Segment,
	Header,
	Divider,
	Input,
	Popup,
	Dropdown,
	Form,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/lib/Creatable';

import {
	setListThunk,
	removeListItemThunk,
	updateListQuantityThunk,
} from '../store/list';
import {
	setIngredientsThunk,
	createIngredientThunk,
} from '../store/ingredients';

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

const selectStyle = {
	option: () => ({ padding: 50 }),
	contorl: () => ({ width: 200 }),
};

const options = [
	{ value: 'chocolate', label: 'Chocolate' },
	{ value: 'strawberry', label: 'Strawberry' },
	{ value: 'vanilla', label: 'Vanilla' },
];
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
			addItemQuantity: null,
		};
	}
	async componentDidMount() {
		const { id } = this.props.match.params;

		await this.props.setList(id);
		const newState = { ...this.state };
		this.props.list.ingredients.forEach(ingredient => {
			newState.ingredients[ingredient.name] = ingredient.quantity;
		});
		this.setState(newState);
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
		this.setState({ disableForm: false, ingredientsOptions });
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

	render() {
		//dont display until loaded
		if (this.state.loading === true) {
			return <div />;
		}

		const list = this.props.list;
		const ingredients = list.ingredients;

		if (ingredients) {
			return (
				<div style={style.wholeTray}>
					<Header
						as="h3"
						content="Your Tray"
						style={style.h3}
						textAlign="center"
					/>
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
														label={{ basic: true, content: ingredient.type }}
														labelPosition="right"
														value={this.state.ingredients[ingredient.name]}
														onChange={this.handleChange}
														disabled={this.state.disableForm}
													/>
												</td>
												<td>{ingredient.note ? ingredient.note : null}</td>
												<td>
													<button
														style={style.listButtons}
														type="button"
														onClick={() =>
															this.handleRemoveItem(list.uuid, ingredient.name)
														}
													>
														Take off shopping list
													</button>
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
											</Form>
										</Popup.Content>
									</Popup>

									{/* <button
										type="button"
										style={{ backgroundColor: '#f5f5f5' }}
										onClick={this.handleFetchIngredients}
									>
										<i aria-hidden="true" className="plus icon" />
										&emsp;ADD
									</button> */}
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
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MyList);
