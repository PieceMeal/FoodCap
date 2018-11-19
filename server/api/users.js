const router = require('express').Router();
const { User } = require('../db/models');
const { runQuery, driver } = require('../db/neo');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});
// grab user recommendations based on liked categories
router.get('/:userId', async (req, res, next) => {
  try {
    let id = req.params.userId;
    let user = await User.findById(id);
    let uuid = user.uuid;
    let recipes = await runQuery(
      `Match (a:Person {uuid: $uuid})-[:like]->(n)-[]-(x:Recipe)
      RETURN DISTINCT x, count(x) AS number, a ORDER BY number DESC LIMIT 8`,
      { uuid: uuid }
    );
    const recipesArray = [];
    recipes.records.forEach((rec, i) => {
      const props = rec.get('x').properties;
      recipesArray[i] = {};
      for (let key in props) {
        recipesArray[i][key] = props[key];
      }
    });

    res.json(recipesArray);
  } catch (err) {
    next(err);
  }
});

router.put('/:userId', async (req, res, next) => {
  try {
    const { favCuisines, favIngredients, mealTypes, favCategory } = req.body;
    let userId = req.params.userId;
    let user = await User.findById(userId);
    let uuid = user.uuid;

    //map through favIngredients and draw a like connection between user and ingredient
    for (let i = 0; i < favIngredients.length; i++) {
      let ingredient = favIngredients[i];
      await runQuery(
        `MATCH (a:Person), (b: Ingredient)
         WHERE a.uuid = $uuid AND b.name = $ingName
         MERGE (a) -[r:like]->(b)
         RETURN r`,
        { uuid: uuid, ingName: ingredient }
      );
    }
    for (let i = 0; i < favCategory.length; i++) {
      let category = favCategory[i];
      await runQuery(`
      MATCH (a: Person {uuid: "${uuid}"}), (b:Category {name: "${category}"})
      MERGE (a)-[:like]->(b)`);
    }
    for (let i = 0; i < favCuisines.length; i++) {
      let cuisine = favCuisines[i];
      await runQuery(`
      MATCH (a: Person {uuid: "${uuid}"}), (b:Cuisine {name: "${cuisine}"})
      MERGE (a)-[:like]-> (b)`);
    }

    //collect all recipes that include the ingredient the user likes
    let recipes = await runQuery(
      `Match (a:Person {uuid: $uuid})-[:like]->(n)-[]-(x:Recipe)
      RETURN DISTINCT x, count(x) AS number, a ORDER BY number DESC LIMIT 8`,
      { uuid: uuid }
    );
    console.log('recipes------', recipes);
    //parse the response from the query so it's an array of recipes
    const recipesArray = [];
    recipes.records.forEach((rec, i) => {
      const props = rec.get('x').properties;
      recipesArray[i] = {};
      for (let key in props) {
        recipesArray[i][key] = props[key];
      }
    });

    let updatedUser = await user.update({
      formFilled: true
    });
    console.log('records for recipes -----------', recipesArray);
    res.json({ user: updatedUser, recipes: recipesArray });
  } catch (err) {
    next(err);
  }
});
