const { runQuery } = require('../db/neo');

const neo4j = require('neo4j-driver').v1;
const router = require('express').Router();

module.exports = router;

// Retrieve single recipe information
router.get('/singleview/:name', async (req, res, next) => {
  try {
    const { records } = await runQuery(
      `match (l:Recipe {name:"${req.params.name}"})
      optional match (l)-[r:hasIngredient]->(i) return l,i,r`
    );
    await runQuery(
      `match (r:Recipe {name:"${req.params.name}"}),(p:Person {uuid:"${
        req.user.uuid
      }"}) merge (r)<-[:HAS_VIEWED]-(p)`
    );
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
    let hasFavorite = await runQuery(
      `match (p:Person {uuid:"${req.user.uuid}"}), (r:Recipe {name: "${
        req.params.name
      }"}) return exists ((p)-[:HAS_FAVORITE]-(r)) as exists`
    );

    returnObject.hasLike = hasFavorite.records[0].get('exists');
    res.json(returnObject);
  } catch (err) {
    next(err);
  }
});

router.get('/popular', async (req, res, next) => {
  try {
    const popularRecArray = [];
    const { records } = await runQuery(
      `match (:Person)-[n:HAS_FAVORITE]->(r:Recipe)  with r, (count(n)*4) as popularity match (:Person)-[f:HAS_VIEWED]->(r) with r, count(f) as views, popularity return r.name as name,r.image as image,r.time as time,(popularity + views) as totalPop order by totalPop desc limit 4`
    );

    Object.keys(records).forEach(key => {
      const name = records[key].get('name');
      const image = records[key].get('image');
      const time = records[key].get('time');
      const recipeObject = { name, image, time };
      popularRecArray.push(recipeObject);
    });

    res.json(popularRecArray);
  } catch (err) {
    next(err);
  }
});
// Retrieve array of recipes based on similar likes and page views, pass uuid as params.
// returned array is sorted by highest relevance at index 0
router.get('/matchonhistory', async (req, res, next) => {
  try {
    const recommendations = {};
    const user = req.user.uuid;
    const orderRec = [];

    let { records } = await runQuery(
      `match (u:Person {uuid: "${user}"})-[:HAS_VIEWED]->(:Recipe)<-[:HAS_VIEWED]-(:Person)-[:HAS_VIEWED]->(f:Recipe) where not (u)-[:HAS_FAVORITE]->(f) with f.name as name, f.image as image, count(f) as importance  return name, image, importance order by importance desc`
    );

    Object.keys(records).forEach(key => {
      const recipe = records[key].get('name');
      const importance = records[key].get('importance').low;
      const image = records[key].get('image');

      if (recommendations[recipe]) {
        recommendations[recipe].importance += importance;
      } else {
        recommendations[recipe] = { name: recipe, image, importance };
      }
    });

    let match = await runQuery(
      `match (u:Person {uuid: "${user}"})-[:HAS_FAVORITE]->(:Recipe)<-[:HAS_FAVORITE]-(:Person)-[:HAS_FAVORITE]->(f:Recipe) where not (u)-[:HAS_FAVORITE]->(f) with f.name as name, f.image as image, (count(f) * 4) as importance  return name, image, importance order by importance desc`
    );
    records = match.records;
    Object.keys(records).forEach(key => {
      const recipe = records[key].get('name');
      const importance = records[key].get('importance').low;
      const image = records[key].get('image');
      if (recommendations[recipe]) {
        recommendations[recipe].importance += importance;
      } else {
        recommendations[recipe] = { name: recipe, image, importance };
      }
    });
    console.log(recommendations);
    Object.keys(recommendations).forEach(recipe => {
      orderRec.push(recommendations[recipe]);
    });
    const sortedRec = orderRec.sort(function(a, b) {
      a = a.importance;
      b = b.importance;
      return b - a;
    });

    res.send(sortedRec, 201);
  } catch (err) {
    next(err);
  }
});

//TOGGLE HAS_FAVORITE
router.put('/toggle', async (req, res, next) => {
  const recipe = req.body.recipeName;
  try {
    await runQuery(
      `match (p:Person {uuid: "${
        req.user.uuid
      }"}),(r:Recipe {name: "${recipe}"}) Create (p)-[:HAS_FAVORITE]->(r) with p,r match (p)-[x:HAS_FAVORITE]->(r), (p)-[:HAS_FAVORITE]->(r) delete x`
    );
  } catch (err) {
    next(err);
  }
  res.send(201);
});

//TOGGLE BOOKMARK FOR LATER
router.get('/', async (req, res, next) => {
  try {
    console.log('we are getting in???', req.query.key)
    let key = req.query.key;
    const { records } = await runQuery(`
    MATCH (n)-[*1]-(r:Recipe)
    WHERE n.name CONTAINS "${key}" OR n.content CONTAINS "${key}" OR n.title CONTAINS "${key}"
    RETURN DISTINCT r
    `);
    const recc = records.map(rec => rec.get('r').properties);
    res.json(recc);
  } catch (err) {
    next(err);
  }
});
