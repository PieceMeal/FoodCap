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

    res.json(returnObject);
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
router.get('/', async (req, res, next) => {
  try {
    let key = req.query.key;

    console.log('key from req.query', key)
    console.log(' from req.query', req.query)
    const {records} = await runQuery(`
    MATCH (n)-[1..3:a]-(r:Recipe)
    WHERE n.name CONTAINS "${key}" OR n.content CONTAINS "${key}" OR n.title CONTAINS "${key}" 
    RETURN n, r`)
    // console.log('our records from query', records[0].get('r'))
    const recc = records.map(rec => rec.get('r'))
    console.log('my record', recc);
    res.json(records)
  } catch (err) {
    next(err)
  }
})
