import React from 'react';

import { Link } from 'react-router-dom';
import { Card, Image, Button, Icon } from 'semantic-ui-react';

//dump component
//pass a recipe object as props
//toggle buttons
const IngredientRow = props => {
	const { ingredients } = props;
	return <React.Fragment />;
};

export default IngredientRow;
// return (
// 	<tr key={i}>
// 		<td>
// 			<b>{ingredient}</b>
// 		</td>
// 		<td>
// 			<Input
// 				name={ingredient}
// 				label={ingredients[ingredient].type || false}
// 				labelPosition="right corner"
// 				value={this.state.ingredients[ingredient.name]}
// 				onChange={this.handleChange}
// 				disabled={this.state.disableForm}
// 			/>
// 		</td>
// 		<td>{ingredient.note ? ingredient.note : null}</td>
// 		<td>
// 			<Button
// 				size="mini"
// 				negative
// 				floated="right"
// 				icon={<Icon name="remove circle" />}
// 				onClick={() =>
// 					this.handleRemoveItem(
// 						list.uuid,
// 						ingredient.name
// 					)
// 				}
// 			/>
// 			<Popup
// 				on="click"
// 				onOpen={() => this.toggleNotePopup(i)}
// 				onClose={() => this.toggleNotePopup(i)}
// 				open={this.state.itemNotePopup[i]}
// 				trigger={
// 					<Button
// 						size="mini"
// 						floated="right"
// 						positive
// 						icon={<Icon name="sticky note outline" />}
// 					/>
// 				}
// 				style={{ width: '300px' }}
// 			>
// 				<Popup.Content>
// 					<Form>
// 						<Input
// 							placeholder="note"
// 							width="1"
// 							onChange={this.handleAddChange}
// 							value={this.state.itemNote}
// 							name="itemNote"
// 						/>
// 						<Button
// 							size="mini"
// 							positive
// 							icon={<Icon name="save" />}
// 							onClick={() =>
// 								this.saveNote(i, ingredient.name)
// 							}
// 						/>
// 					</Form>
// 				</Popup.Content>
// 			</Popup>
// 		</td>
// 	</tr>
// );
