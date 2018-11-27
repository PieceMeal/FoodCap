import React, { Component } from 'react';
import Navbar from './navbar';
import { Header, List } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setListThunk } from '../store/list';

import { getIngredientsThunk } from '../store/singlerecipe';

class MyList extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			ingredients: [],
		};
	}
	async componentDidMount() {
		const { id } = this.props.match.params;
		this.setState({ loading: true });

		await this.props.setList(id);
		this.setState({ loading: false });
	}

	render() {
		//dont display until loaded
		console.log(this.props.categoryMap);
		if (this.state.loading === true) {
			return <div />;
		}
		const categoryMap = this.props.categoryMap;
		if (categoryMap) {
			return (
				<React.Fragment>
					<Navbar />

					<List>
						{Object.keys(categoryMap).map(category => {
							return (
								<React.Fragment key={category}>
									<Header>{category} </Header>

									{categoryMap[category].map(i => {
										return (
											<List.Item key={i.name}>
												{i.quantity} {i.type} {i.name}
												<List.Description>{i.notes}</List.Description>
											</List.Item>
										);
									})}
								</React.Fragment>
							);
						})}
					</List>
				</React.Fragment>
			);
		} else {
			return <div>LOADING</div>;
		}
	}
}

const mapStateToProps = state => {
	const { list } = state;
	console.log(list);
	const categoryMap = {};
	if (list.ingredients) {
		list.ingredients.forEach(i => {
			const { name, quantity, type, category } = i;
			const categoryName = category.length > 0 ? category : 'other';
			if (!categoryMap[categoryName]) categoryMap[categoryName] = [];
			categoryMap[categoryName].push({ name, quantity, type });
		});
	}
	return {
		categoryMap,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setList: id => dispatch(setListThunk(id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MyList);
