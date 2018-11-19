import React from 'react';

import { Link } from 'react-router-dom';
import { Card, Image } from 'semantic-ui-react';
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
		</Card>
	);
};

export default RecipeCard;
