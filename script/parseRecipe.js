const axios = require('axios');
const recipes = require('./JonDb.json');

// console.log(Object.keys(recipes));

// const {body} = await axios({
//   url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
//   method: 'post',
//   headers: {

//     'Content-Type': 'application/json',
//     'x-app-id': 'f026d80b',
//     'x-app-key': '05ce0fcdd82695997573bf88c043f4c2'
//   }
// })
const getNutrition = async ingredients => {
	try {
		const { data } = await axios.post(
			'https://trackapi.nutritionix.com/v2/natural/nutrients',
			{ query: ingredients },
			{
				headers: {
					'Content-Type': 'application/json',
					'x-app-id': 'f026d80b',
					'x-app-key': '05ce0fcdd82695997573bf88c043f4c2',
				},
			}
		);
		return data.foods;
	} catch (e) {
		console.error(e);
	}
};

async function parseIngredients() {
	const ingredientsList = {};
	const keys = Object.keys(recipes);

	const recipe = recipes[keys[0]];
	const ingredients = recipe.ingredients.join(', ');
	try {
		const responseData = await getNutrition(ingredients);
		responseData.forEach(item => {
			ingredientsList[item.food_name] = {
				quantity: item.serving_qty,
				type: item.serving_unit,
			};
		});
		console.log(ingredientsList);
	} catch (e) {
		console.error(e);
	}
}

parseIngredients();
