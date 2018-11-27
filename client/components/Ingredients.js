import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
	Container,
	Grid,
	Card,
	Image,
	Button,
	Popup,
	Form,
	Checkbox,
} from 'semantic-ui-react';
import axios from 'axios';
import { throws } from 'assert';
export default class Ingredients extends Component {
	constructor() {
		super();
		this.state = {
			ingredients: [],
		};
	}

	async componentDidMount() {
		const { data } = await axios.get('/api/ingredients/categories');
		this.setState({ ingredients: data });
	}

	render() {
		return (
			<React.Fragment>
				{this.state.ingredients.map(i => {
					return (
						<div key={i.name}>
							{i.name} {i.category}
						</div>
					);
				})}
			</React.Fragment>
		);
	}
}
