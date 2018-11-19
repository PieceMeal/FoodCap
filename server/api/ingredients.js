const router = require('express').Router();
const { runQuery } = require('../db/neo');
const neo4j = require('neo4j-driver').v1;

module.exports = router;

//GET (/api/ingredients)
//expects: nothing required
//returns the names of all ingredients
router.get('/', async (req, res, next) => {
	console.log('test');
	try {
		console.log();
		const { records } = await runQuery(
			`MATCH (i:Ingredient) RETURN i.name ORDER BY i.name`
		);
		const ingredients = [];

		records.forEach(record => {
			ingredients.push(record.get('i.name'));
		});
		res.json(ingredients);
	} catch (err) {
		next(err);
	}
});

router.post('/', async (req, res, next) => {
	const { name } = req.body;
	console.log('in route');
	try {
		const { records } = await runQuery(`CREATE (:Ingredient {name: $name})`, {
			name,
		});
		console.log(records);
		res.json({ status: true, name });
	} catch (err) {
		next(err);
	}
});
