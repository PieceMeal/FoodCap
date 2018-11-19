import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import ListPreview from './ListPreview';
import { connect } from 'react-redux';
import {
	Container,
	Header,
	Icon,
	Divider,
	Grid,
	Card,
	Image,
	Button,
	Popup,
	Input,
	Form,
	Checkbox,
} from 'semantic-ui-react';
import { fetchRecipes } from '../store/user';
import {
	createList,
	setListsThunk,
	addRecipeToListThunk,
} from '../store/lists';
import Navbar from './navbar'

/**
 * COMPONENT
 */
class UserHome extends React.Component {
	state = {
		listName: '',
		checked: {},
	};
	componentDidMount() {
		this.props.fetchRecipes(this.props.user.id);
		this.props.setListsThunk();
	}
	handleSubmit = e => {
		//have a thunk in lists.js that will take this action and dispatch post request for list api
		//clear the state after submit so input is empty
		e.preventDefault();

		this.props.createList(this.state.listName);
		this.setState({
			listName: '',
		});
	};
	handleChange = e => {
		this.setState({
			listName: e.target.value,
		});
	};
	handleChangeList = (e, { value, name }) => {
		//have a thunk that sends information about the list and information about
		this.setState(prevState => {
			return { checked: { ...prevState.checked, [name]: value } };
		});
	};
	handleSubmitList = e => {
		e.preventDefault();
		let recipe = Object.keys(this.state.checked).toString();
		let uuid = this.state.checked[recipe];
		let body = { uuid, recipe };
		//dispatch thank for sending list info, recipe info
		this.props.addRecipeToListThunk(body);
		this.setState({ [recipe]: false });
	};
	handleOpen = name => {
		this.setState({ [name]: true });
	};
	handleClose = name => {
		this.setState({ [name]: false });
	};
	render() {
		console.log('lists should be like this', this.props.lists);
		const disableSubmitButton = Object.keys(this.state.checked).length;
		if (this.props.recipes) {
			return (
				<div>
					<Navbar />
					<Container>
						<div>
							<Header as="h2" icon textAlign="center">
								<Icon name="users" circular />
								<Header.Content>Hello {this.props.email}</Header.Content>
							</Header>
							<Form onSubmit={this.handleSubmit}>
								<Input
									size="large"
									icon="add"
									placeholder="create new list..."
									onChange={this.handleChange}
									value={this.state.listName}
								/>
							</Form>
						</div>
						<Divider />
						<Container>
							<ListPreview />
						</Container>
						<Divider />
						<Divider />
						<Grid columns={4}>
							<Grid.Row>
								{this.props.recipes.map((rec, id) => {
									return (
										<Grid.Column key={id}>
											<Card>
												<Link to={`/recipes/singleview/${rec.name}`}> <Image src={rec.image} /> </Link>
												<Card.Content>
													<Card.Header>{rec.name}</Card.Header>
													<Container textAlign="right">
														{this.props.lists ? (
															<Popup
																on="click"
																open={this.state[rec.name]}
																onOpen={() => this.handleOpen(rec.name)}
																onClose={() => this.handleClose(rec.name)}
																trigger={<Button icon="add" />}
																content={
																	<Form onSubmit={this.handleSubmitList}>
																		{this.props.lists.map(list => {
																			return (
																				<Form.Field key={list.uuid}>
																					<Checkbox
																						name={rec.name}
																						value={list.uuid}
																						label={list.name}
																						onChange={this.handleChangeList}
																						checked={
																							list.uuid ===
																							this.state.checked[rec.name]
																						}
																					/>
																				</Form.Field>
																			);
																		})}
																		<Button
																			disabled={!disableSubmitButton}
																			type="submit"
																		>
																			Submit
																	</Button>
																	</Form>
																}
																on="click"
															/>
														) : (
																<Button icon="x" />
															)}
													</Container>
													<Card.Meta>Time: {rec.time}</Card.Meta>
												</Card.Content>
											</Card>
										</Grid.Column>
									);
								})}
							</Grid.Row>
						</Grid>
					</Container>
				</div>
			);
		} else {
			//loading page ??
			return <div />;
		}
	}
}
/**
 * CONTAINER
 */
const mapState = state => {
	return {
		email: state.user.email,

		user: state.user,
		recipes: state.user.recipes,
		lists: state.lists,
	};
};
const dispatchState = dispatch => ({
	fetchRecipes: id => dispatch(fetchRecipes(id)),
	createList: name => dispatch(createList(name)),
	setListsThunk: () => dispatch(setListsThunk()),
	addRecipeToListThunk: body => dispatch(addRecipeToListThunk(body)),
});

export default connect(mapState, dispatchState)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
	email: PropTypes.string,
};
