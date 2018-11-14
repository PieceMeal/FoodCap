'use strict'

const db = require('../server/db')
const {User} = require('../server/db/models')
const database = require('./db.json')

//neo4j deleting all nodes before run seed --------------------------------------------
let {session, driver} = require('../server/db/neo')
session.run('MATCH (n) detach delete n')
session.close();
//----------------------------

//check that recipe name is unique before creating the node
session.run(`CREATE CONSTRAINT ON (recipe:Recipe) ASSERT recipe.name IS UNIQUE`)
//maps through json database and creates recipe nodes (run by seed function)
const recipeSeeder = async db => {
  for (let key in db) {
    if (db.hasOwnProperty(key)) {
      await session.run(
        'CREATE (a:Recipe {name:$name, ingredients:$ingredients, instructions:$instructions, time:$time, serves:$serves}) RETURN a',
        { name: key,                            //string
          ingredients: db[key]["ingredients"],  //array of strings
          instructions: db[key]["method"],      //array of strings
          time: db[key]["time"]["totalMins"],   //string number
          serves: db[key]["serves"]             //string
        }
      )
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
    await seed()
    await recipeSeeder(database)
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
