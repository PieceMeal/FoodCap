const { runQuery } = require('../db/neo');

const neo4j = require('neo4j-driver').v1;
const router = require('express').Router();

module.exports = router;

router.get('/singleview/:name', async (req, res, next) => {
  try {
    const { records } = await runQuery(
      `match (l:Recipe {name:"${req.params.name}"})
      optional match (l)-[r:hasIngredient]->(i) return l,i,r`
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
