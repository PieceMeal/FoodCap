import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { setListsThunk } from '../store/lists';

import { Button, Grid, Segment, Header, Divider } from 'semantic-ui-react';

const mapStateToProps = state => {
	const { lists } = state;
	return {
		lists,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setLists: () => dispatch(setListsThunk()),
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

const selectStyle = {
	option: () => ({ padding: 50 }),
	contorl: () => ({ width: 200 }),
};

class MyLists extends Component {
	componentDidMount() {
		console.log('MyLists Mount');
		this.props.setLists();
	}
	render() {
		let { lists, ingredients } = this.props;

		return (
			<div>
				{this.props.lists.map(list => {
					console.log(list);
					const txt = '/lists/' + list.uuid;
					return (
						<div key={list.uuid}>
							<Link to={txt}>{list.name}</Link>
							<br />
						</div>
					);
				})}
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MyLists);
