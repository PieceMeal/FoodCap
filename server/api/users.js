const router = require('express').Router();
const { User } = require('../db/models');
const { runQuery, driver } = require('../db/neo');

module.exports = router;

//Jaccard théoreme running every 5 min to delete connections between user nodes and recreate new ones taking in consideration new views and new favorites

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

// grab user recommendations based on [:similar] connections to other users, before grabbing recommendations we:
// DETACH OLD SIMILAR CONNECTIONS, RUN SIMILARITY INDEX AND REATTACH - THEN SEND RECS BACK
router.get('/userrec', async (req, res, next) => {
  try {
    console.log('this is being run???')
    let uuid = req.user.uuid;
    await runQuery(`MATCH(:Person)-[s:similar]-(:Person) DELETE s`);

    await runQuery(
      `MATCH(p:Person)-[:like|:HAS_VIEWED|:HAS_FAVORITE]-(n) WITH {item:id(p), categories:collect(id(n))} AS userdata WITH collect(userdata) AS data CALL algo.similarity.jaccard.stream(data, {topK:3, similarityCutoff:0.0}) YIELD item1, item2, count1, count2, intersection, similarity MATCH (z:Person {uuid: algo.getNodeById(item1).uuid}),(y:Person {uuid: algo.getNodeById(item2).uuid}) MERGE (z)-[c:similar]->(y) RETURN z`
    );
    let recipes = await runQuery(`
    Match (a:Person {uuid: "${uuid}"})-[z:similar]->(b:Person)-[:HAS_VIEWED |:HAS_FAVORITE]-(c:Recipe)where not (a)-[:HAS_FAVORITE]-(c) with count(c)as importance,a,b,c return distinct c limit 8`);

    const recipesArray = [];
    recipes.records.forEach((rec, i) => {
      const props = rec.get('c').properties;
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
router.put('/setaccountinfo', async (req, res, next) => {
  const user = req.user.uuid;
  const userInfo = await User.update(req.body, {
    where: { uuid: user },
    returning: true,
    plain: true
  });

  res.json(userInfo[1], 201);
});
// Set user [:like] to ingredient, category and cuisine & set [:similar] with Jaccard

router.put('/setpref/:userId', async (req, res, next) => {
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

    let updatedUser = await user.update({
      formFilled: true
    });
    res.json({ user: updatedUser });
  } catch (err) {
    next(err);
  }
});
