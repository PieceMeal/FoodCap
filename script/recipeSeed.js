const database = require('./db.json')
const { session, driver } = require('../server/db/neo')

//don't know what this is doing
session.run(`MATCH (n) detach delete n`)

//check that recipe name is unique before creating the node
session.run(`CREATE CONSTRAINT ON (recipe:Recipe) ASSERT recipe.name IS UNIQUE`)

//run this to map through json database and create a node for each recipe
const dbParser = db => {
  for (let key in db) {
    if (db.hasOwnProperty(key)) {
      //this maybe needs to be in backticks
      session.run(
        'CREATE (a:Recipe {name:$name, ingredients:$ingredients, instructions:$instructions, time:$time, serves:$serves}) RETURN a',
        { name: key,                            //string
          ingredients: db[key]["ingredients"],  //array of strings
          instructions: db[key]["method"],      //array of strings
          time: db[key]["time"]["totalMins"],   //string number
          serves: db[key]["serves"]             //string
        }
      ).then(result => {
        session.close();

        const singleRecord = result.records[0];
        const node = singleRecord.get(0);

        console.log('we are getting here with ', node);

        // on application exit:
      })
    }
  }
  driver.close();
}

dbParser(database)


