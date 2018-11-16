const router = require('express').Router();
const { User } = require('../db/models');
const { createUser } = require('../utils/createUsers');
const { session, driver } = require('../db/neo');
const uuidv1 = require('uuid/v1');
const neo4j = require('neo4j-driver').v1;

module.exports = router;
//TODO:
//add way to verify a user owns a list

//POST (/api/lists)
//expects: req.body.listName
//creates a list node that is has a relationship to
//req.user.uuid
router.post('/', async (req, res, next) => {
	try {
		const { listName } = req.body;
		const { records } = await session.run(
			`MATCH (a:Person {uuid: '${
				req.user.uuid
			}'}) CREATE (l:List {name:'${listName}', uuid: '${uuidv1()}'}) MERGE (a)-[:hasList{status:'incomplete'}]->(l) RETURN l`
		);
		console.log(records);
		session.close();

		res.json(records[0].get('l'));
	} catch (err) {
		next(err);
	}
});

//GET (/api/lists)
//expects: nothing required
//returns the current logged in user (req.user)'s lists
// only returns name and uuid
router.get('/', async (req, res, next) => {
	try {
		const { records } = await session.run(
			`MATCH (a:Person {uuid: '${req.user.uuid}'})-[:hasList]-(l:List) RETURN l`
		);
		session.close();
		console.log(records.length);
		const returnObject = [];

		records.forEach((record, i) => {
			const props = record.get('l').properties;
			returnObject[i] = {};
			for (let key in props) {
				returnObject[i][key] = props[key];
			}
		});

		res.json(returnObject);
	} catch (err) {
		next(err);
	}
});

//ADD A ROUTE FOR GETTING LIST BY ID
//GET (/api/lists)
//expects: nothing required
//returns the current logged in user (req.user)'s lists
//returns ingredients
router.get('/:listId', async (req, res, next) => {
	try {
		const { listId } = req.params;
		console.log(listId);
		const { records } = await session.run(
			`MATCH (a:Person {uuid: '${
				req.user.uuid
			}'})-[:hasList]-(l:List {uuid: '${listId}'})
     OPTIONAL MATCH (l)-[r:hasIngredient]-(i:Ingredient) RETURN l,i,r`
		);

		session.close();
		const returnObject = {};
		//grab list info
		const props = records[0].get('l').properties;
		for (let key in props) {
			returnObject[key] = props[key];
		}
		//NOTE: if you return multiple ingredients, there is some redundant info
		//records will be the same list

		//make ingredients key an array
		returnObject.ingredients = [];

		//loop to get all ingredients
		records.forEach((record, i) => {
			//grab properties for each ingredient
			if (record.get('i')) {
				const props = record.get('i').properties;
				const relationship = record.get('r').properties;
				//make each element of array an object
				returnObject.ingredients[i] = {};
				//loop through and add all properties to the array element
				for (let key in props) {
					returnObject.ingredients[i][key] = props[key];
				}
				for (let key in relationship) {
					returnObject.ingredients[i][key] = relationship[key];

					if (neo4j.isInt(relationship[key])) {
						returnObject.ingredients[i][key] = relationship[key].toString();
					}
				}
			}
		});
		res.json(returnObject);
	} catch (err) {
		next(err);
	}
});

//PUT (/api/lists/favorite)
//expects: req.body.uuid to match the uuic of list
router.put('/favorite', async (req, res, next) => {
	try {
		const { uuid } = req.body;
		console.log('in route ');
		console.log(req.body);

		const { records } = await session.run(
			`MATCH (a:Person {uuid: '${
				req.user.uuid
			}'}) MATCH(l:List {uuid: '${uuid}'}) MERGE (a)-[r:isFavorite]->(l) RETURN r`
		);
		session.close();
		console.log();
		res.json({ relationship: records[0].get('r').type });
	} catch (err) {
		next(err);
	}
});

//PUT (/api/lists/addrecipe)
//expects: req.body.uuid to match the uuic of list
//         req.body.recipe to match the name of the recipe
router.put('/addrecipe', async (req, res, next) => {
	try {
		//list uuid and recipe name
		const { uuid, recipe } = req.body;
		console.log('in route ');
		console.log(req.body);

		const { records } = await session.run(
			`MATCH (l:List {uuid: '${uuid}'})
      MATCH(r:Recipe {name: '${recipe}'})
      MATCH (r)-[z:hasIngredient]->(i)
      MERGE (l)-[newIngredient:hasIngredient]->(i)
      MERGE (l)-[:hasRecipe]->(r)
      SET newIngredient += properties(z)
       RETURN l,r,i`
		);
		session.close();
		console.log(records);
		res.json({ records });
		// set ingredient += properties(z)
	} catch (err) {
		next(err);
	}
});

/*
change above to the following when adding to check if list belongs to user
const {records} = await session.run(
      `MATCH (:Person {uuid: '${
        req.user.uuid
      }'})-[:HAS_LIST]->
        (l:List {uuid: '${
       uuid
      }'}) MATCH(r:Recipe {name: '${recipe}'}) MATCH (r)-[z:hasIngredient]->(i) MERGE (l)-[:hasIngredient{quantity: z.quantity, type: z.type}]->(i) RETURN l,r`
    )
    */

//PUT (/api/lists/addingredient)
//expects: req.body.uuid to match the uuic of list
//         req.body.ingredient to be the name of ingredient
//        req.body.quantity to be the quantity of ingredient
//        req.body.type to be the type for quantity
router.put('/addingredient', async (req, res, next) => {
	try {
		//list uuid and recipe name
		const { uuid, ingredient, quantity, type } = req.body;
		console.log('in route ');
		console.log(req.body);

		const { records } = await session.run(
			`MATCH (l:List {uuid: '${uuid}'})
      MERGE(i:Ingredient {name: '${ingredient}'})
      MERGE (l)-[:hasIngredient{quantity: ${quantity}, type: ${type}}]->(i)
       RETURN l,i`
		);
		session.close();
		console.log(records);
		res.json({ records });
	} catch (err) {
		next(err);
	}
});
//add below to above when adding user autentication
/*
`MATCH (:Person {uuid: '${
  req.user.uuid
}'})-[:HAS_LIST]->
*/

//PUT (/api/lists/removeingredient)
//expects: req.body.uuid to match the uuic of list
//         req.body.ingredient to be the name of ingredient
router.put('/removeingredient', async (req, res, next) => {
	try {
		//list uuid and recipe name
		const { uuid, ingredient } = req.body;
		console.log('in route ');
		console.log(req.body);

		const { records } = await session.run(
			`MATCH (l:List {uuid: '${uuid}'})-[r:hasIngredient]->(i:Ingredient{name:'${ingredient}'}) DELETE r
       RETURN l`
		);
		session.close();
		console.log(records);
		res.json({ records });
	} catch (err) {
		next(err);
	}
});
//add below to above when adding user autentication
/*
`MATCH (:Person {uuid: '${
  req.user.uuid
}'})-[:HAS_LIST]->
*/

//PUT (/api/lists/removeingredient)
//expects: req.body.uuid to match the uuic of list
//         req.body.ingredient to be the name of ingredient
//         req.body.quantity to be new quantity #
//         req.body.type to be new quantity type
router.put('/updateingredient', async (req, res, next) => {
	try {
		//list uuid and recipe name
		const { uuid, ingredient, quantity, type } = req.body;
		console.log('in route ');
		console.log(req.body);

		const { records } = await session.run(
			`MATCH (l:List {uuid: '${uuid}'})-[r:hasIngredient]->(i:Ingredient{name:'${ingredient}'}) SET r.quantity='${quantity}', r.type='${type}'
       RETURN l`
		);

		session.close();
		console.log(records);
		res.json({ records });
	} catch (err) {
		next(err);
	}
});
//add below to above when adding user autentication
/*
`MATCH (:Person {uuid: '${
  req.user.uuid
}'})-[:HAS_LIST]->
*/
