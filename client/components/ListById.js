import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setListThunk } from '../store/list';
import { Button, Grid, Segment, Header, Divider } from 'semantic-ui-react';
import { MyList } from './';
// let dummyData = [
//   { name: 'turkey', unit: 'lb', quant: 5, id: 1 },
//   {
//     name: 'smoked streaky bacon',
//     unit: 'pieces',
//     quant: 6,
//     id: 2,
//     note: 'high-fat plox'
//   },
//   { name: 'sunflower oil', unit: null, quant: null, id: 3 },
//   {
//     name: 'flour',
//     unit: 'oz',
//     quant: 8,
//     id: 4,
//     note: '00 baking flour, preferably this brand'
//   },
//   { name: 'olive oil', unit: 'tbsp', quant: 8, id: 5 }
// ];

const mapStateToProps = state => {
	return {
		list: state.list,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setList: id => dispatch(setListThunk(id)),
	};
};

const style = {
	h3: {
		marginTop: '1em',
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

class ListById extends Component {
	componentDidMount() {
		const { id } = this.props.match.params;
		//console.log(this.props)
		this.props.setList(id);
	}
	render() {
		let { list } = this.props;

		//DUMMY VERSION
		return (
			<div>
				<MyList list={list} />
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ListById);
