import React from 'react';
import { connect } from 'react-redux';

import { Table, Modal, Input, Button } from 'semantic-ui-react';

import { resolveConflictThunk } from '../store/list';
//dump component
//pass a recipe object as props
//toggle buttons
class ItemsConflictModal extends React.Component {
	constructor() {
		super();

		this.state = {
			name: '',
			quantity: 0,
			type: '',
		};
	}

	componentDidMount() {
		console.log(this.props);
		let quantity = 0;

		for (let i = 0; i < this.props.item.length; i++) {
			quantity += +this.props.item[i].quantity;
		}
		this.setState({ name: this.props.item[0].name, quantity });
	}

	handleChange = evt => {
		this.setState({ [evt.target.name]: evt.target.value });
	};

	resolveConflict = () => {
		//props.uuid, this.state.name, this.state.quantity, this.state.type
		this.props.resolve(
			this.props.uuid,
			this.state.name,
			this.state.quantity,
			this.state.type
		);
		console.log('!!!');
	};

	render() {
		if (this.props.item.length === 0) return null;
		return (
			<React.Fragment>
				<Modal.Header>Resolve your conflicts to continue</Modal.Header>
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Item Name</Table.HeaderCell>
							<Table.HeaderCell>Quantity</Table.HeaderCell>
							<Table.HeaderCell>Type</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{this.props.item.map((single, i) => {
							return (
								<Table.Row key={i}>
									<Table.Cell> {single.name} </Table.Cell>

									<Table.Cell>{single.quantity}</Table.Cell>
									<Table.Cell>{single.type}</Table.Cell>
								</Table.Row>
							);
						})}
						<Table.Row>
							<Table.Cell>
								<Input
									disabled
									name="name"
									value={this.state.name}
									onChange={this.handleChange}
								/>
							</Table.Cell>
							<Table.Cell>
								<Input
									name="quantity"
									value={this.state.quantity}
									onChange={this.handleChange}
								/>
							</Table.Cell>
							<Table.Cell>
								<Input
									name="type"
									value={this.state.type}
									onChange={this.handleChange}
								/>
							</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
				<Button basic color="green" onClick={this.resolveConflict}>
					Resolve
				</Button>
				{/*
			<Modal.Content>
				{props.items.map(item => {
					return <div key={item.name}> {item.name}</div>;
				})}
			</Modal.Content> */}
			</React.Fragment>
		);
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
		resolve: (uuid, ingredient, quantity, type) =>
			dispatch(resolveConflictThunk(uuid, ingredient, quantity, type)),
	};
};

export default connect(null, mapDispatchToProps)(ItemsConflictModal);
