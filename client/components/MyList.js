import React, { Component } from 'react';
import {
	Button,
	Grid,
	Segment,
	Header,
	Divider,
	Input,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
	setListThunk,
	removeListItemThunk,
	updateListQuantityThunk,
} from '../store/list';
const mapStateToProps = state => {
	console.log('map state');
	return {
		list: state.list,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setList: id => dispatch(setListThunk(id)),
		removeListItem: (uuid, ingredient) =>
			dispatch(removeListItemThunk(uuid, ingredient)),
		updateItems: (uuid, updatedItems) =>
			dispatch(updateListQuantityThunk(uuid, updatedItems)),
	};
};

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
		this.state = { loading: false };
	}
	async componentDidMount() {
		const { id } = this.props.match.params;

		await this.props.setList(id);
		this.props.list.ingredients.forEach(ingredient => {
			this.setState({ [ingredient.name]: ingredient.quantity });
		});
	}
	handleClick = async (uuid, ingredient) => {
		console.log(uuid, ingredient);
		this.setState({ loading: true });
		await this.props.removeListItem(uuid, ingredient);
		this.setState({ loading: false });
	};

	handleChange = evt => {
		console.log(evt.target.name, evt.target.value);
		this.setState({ [evt.target.name]: evt.target.value });
	};
	handleUpdate = async uuid => {
		const updatedItems = [];
		this.props.list.ingredients.forEach(ingredient => {
			if (+ingredient.quantity !== +this.state[ingredient.name]) {
				updatedItems.push({
					name: ingredient.name,
					quantity: this.state[ingredient.name],
					type: ingredient.type,
				});
			}
		});
		if (updatedItems.length > 0) {
			this.setState({ loading: true });

			await this.props.updateItems(uuid, updatedItems);
			this.setState({ loading: false });
		}
	};

	render() {
		console.log('render');
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
														value={this.state[ingredient.name]}
														onChange={this.handleChange}
														disabled={this.state.loading}
													/>
												</td>
												<td>{ingredient.note ? ingredient.note : null}</td>
												<td>
													<button
														style={style.listButtons}
														type="button"
														onClick={() =>
															this.handleClick(list.uuid, ingredient.name)
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
									<button type="button" style={{ backgroundColor: '#f5f5f5' }}>
										<i aria-hidden="true" className="plus icon" />
										&emsp;ADD
									</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyList);
