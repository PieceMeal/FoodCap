'use strict'

const db = require('../server/db')
const {User} = require('../server/db/models')
const database = require('./database.json')
let {session, driver} = require('../server/db/neo')




const testRecipe = {
  "Sixteen-minute pizza": {
    "ingredients": {
      "flour":        {"quantity": 1, "type": "cup"},
      "olive oil":    {"quantity": 8, "type": "tbsp"},
      "salt":         {"quantity": 1, "type": "tsp"},
      "tomato paste": {"quantity": 1, "type": "can"},
      "mushrooms":    {"quantity": 1, "type": "package"},
      "prosciutto":   {"quantity": 4, "type": "slices"},
      "gorgonzola":   {"quantity": 4, "type": "oz"},
      "egg":          {"quantity": 1, "type": "egg"}
    },
    "method":
      ["Preheat the oven to 200C/400F/Gas 6.","For the pizza base, place the flour, oil, water and salt into a food processor and blend together until a dough is formed. Tip out onto a floured work surface and knead. Shape into a round base about 20cm/8in wide. ","Place into a frying pan over a high heat and brown the base, then using a mini-blowtorch, crisp the top of the pizza. (Alternatively you can do this under the grill.) ","For the topping, spread tomato purée over the top of the base. ","Fry the mushrooms in a dry frying pan then scatter over the tomato purée. Arrange the prosciutto and cheese on top. ","Crack an egg into the middle, then place into the oven for five minutes to finish cooking. ","Serve on a large plate, and slice into wedges to serve."],
    "url":"www_bbc_com_food_recipes_10minutepizza_87314",
    "title":"Ten-minute pizza",
    "time":{
        "preparationMins":30,
        "cookingMins":10,
        "totalMins":40},
    "serves":"Makes 1",
    "isVegetarian":false,
    "recommendations":0}
}

//maps through json database and creates recipe nodes (run by seed function)
const recipeSeeder = async db => {
session.run('MATCH (n) DETACH DELETE n')

//check that recipe name is unique before creating the node
//we are not sure why it works, but it works
session.run(`CREATE CONSTRAINT ON (recipe:Recipe) ASSERT recipe.name IS UNIQUE`)
session.run(`CREATE CONSTRAINT ON (ingredient:Ingredient) ASSERT ingredient.name IS UNIQUE`)
// session.close();

  for (let recipe in db) {
    if (db.hasOwnProperty(recipe)) {
      const recipeObj = db[recipe]
      //create recipe node
      await session.run(
        'CREATE (a:Recipe {name:$name, instructions:$instructions, time:$time, serves:$serves}) RETURN a',
        { name: recipe,                            //string
          instructions: recipeObj["method"],      //array of strings
          time: recipeObj["time"]["totalMins"],   //string number
          serves: recipeObj["serves"]             //string
        }
      )
      const ingredientsObj = recipeObj.ingredients
      for (let ingredient in ingredientsObj) {
        if (ingredientsObj.hasOwnProperty(ingredient)) {
          //create ingredient nodes that don't already exist
          await session.run(
            'CREATE (b:Ingredient {name:$name}) RETURN b',
            { name: ingredient }
          )
          //establish relationship between recipe and ingredient
          await session.run(
            `MATCH (a:Recipe), (b:Ingredient)
            WHERE a.name = $aName AND b.name = $bName
            CREATE (a)-[r:hasIngredient {quantity: $quantity, type: $type} ]->(b) RETURN r`,
            { aName: recipe,
              bName: ingredient,
              quantity: ingredientsObj[ingredient]['quantity'],
              type: ingredientsObj[ingredient]['type']
            }
          )
        }
      }
      session.close()
    }
  }
  driver.close();
}

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({ email: 'cody@email.com', password: '123'}),
    User.create({ email: 'murphy@email.com', password: '123'})
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}




// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    //neo4j deleting all nodes before run seed --------------------------------------------
    await recipeSeeder(database)
    await seed()

  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
