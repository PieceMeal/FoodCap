import React, { Component } from 'react';
import {
	Input,
	Button
} from 'semantic-ui-react';
import axios from 'axios';
export default class Ingredients extends Component {
	constructor() {
		super();
		this.state = {
			ingredients: {},
		};
	}

	handleChange = (evt,name) => {
		console.log(evt.target.value,name)
		const ingredients = this.state.ingredients
		ingredients[name] = evt.target.value
		this.setState({ingredients})
	}

	handleClick = async (name) => {
		const { data } = await axios.put('/api/ingredients/update',{name,category:this.state.ingredients[name]});
		console.log(name + " has been updated")
	}

	async componentDidMount() {
		const { data } = await axios.get('/api/ingredients/categories');
		const ingredients = {}
		data.forEach(item=>ingredients[item.name]=item.category)
		this.setState({ ingredients });
	}

	render() {
		return (
			<React.Fragment>
				{Object.keys(this.state.ingredients).map(i => {
					return (
						<div key={i}>
							{i} <Input value={this.state.ingredients[i]}onChange={(e)=>this.handleChange(e,i)} /> <Button onClick={()=>this.handleClick(i)}>Update</Button>
						</div>
					);
				})}
			</React.Fragment>
		);
	}
}
