import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Image, Button, Icon } from 'semantic-ui-react';

//dump component
//pass a recipe object as props
//toggle buttons

const RecipeCard = props => {
	const { recipe } = props;
	return (
		<Card>
			<Link to={`/recipes/singleview/${recipe.name}`}>
				<Image src={recipe.image} />
			</Link>
			<Card.Content>
				<Card.Header>{recipe.name}</Card.Header>
			</Card.Content>
			<Card.Content extra>
				{props.toggleButtons && (
					<Button
						size="mini"
						negative
						floated="right"
						icon={<Icon name="remove circle" />}
						onClick={() => props.removeRecipe(props.recipe.name)}
					/>
				)}
			</Card.Content>
		</Card>
	);
};

export default RecipeCard;
