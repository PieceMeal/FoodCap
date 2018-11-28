import React, { Component } from 'react';
import {
	Input,
	Button,
	Select
} from 'semantic-ui-react';
import axios from 'axios';
export default class Ingredients extends Component {
	constructor() {
		super();
		this.state = {
			ingredients: {},
		};
	}
	 options = [ {key:'produce', value:'produce', text:'Produce'},
	 {key:'meat', value:'meat', text:'Meat/Seafood'},
	 {key:'dairy', value:'dairy', text:'Dairy'},
	 {key:'beverages', value:'beverages', text:'Beverages'},
	 {key:'bakery', value:'bakery', text:'Bakery & Deli'},
	 {key:'frozen', value:'frozen', text:'Refrigerated / Frozen'},
	 {key:'pantry', value:'pantry', text:'Pantry'},
	 {key:'other', value:'other', text:'Other'}];

	handleChange = async (evt,{value},name) => {
		console.log(value, name)
		const ingredients = this.state.ingredients
		ingredients[name] = value
		this.setState({ingredients})
		const { data } = await axios.put('/api/ingredients/update',{name,category:value});

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
							{i}
							<Select options={this.options} value={this.state.ingredients[i]} onChange={(...e) =>this.handleChange(...e,i) }/>
						</div>
					);
				})}
			</React.Fragment>
		);
	}
}
