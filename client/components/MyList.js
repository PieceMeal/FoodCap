import React, { Component } from 'react';
import { setListThunk } from '../store/list';
import { Button, Grid, Segment, Header, Divider } from 'semantic-ui-react';

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

const MyList = props => {
	// The back end is not hooked up yet!!
	console.log(props);
	const ingredients = props.list.ingredients;
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
												<small>
													{ingredient.quantity}&ensp;{ingredient.type}
												</small>
											</td>
											<td>{ingredient.note ? ingredient.note : null}</td>
											<td>
												<button style={style.listButtons} type="button">
													Take off shopping list
												</button>
												<button style={style.listButtons} type="button">
													<i aria-hidden="true" className="angle down icon" />
												</button>
												<button style={style.listButtons} type="button">
													<i aria-hidden="true" className="angle up icon" />
												</button>
											</td>
										</tr>
									);
							  })
							: null}
						<tr>
							<td>
								<button style={{ backgroundColor: '#f5f5f5' }}>
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
				</span>
			</div>
		);
	} else {
		return <div>LOADING</div>;
	}
};

export default MyList;
