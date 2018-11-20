'use strict';

const db = require('../server/db');
const { User } = require('../server/db/models');
const database = require('./database.json');
let { session, driver, runQuery } = require('../server/db/neo');
let random = require('random-name');

const testRecipe = {
  'Sixteen-minute pizza': {
    ingredients: {
      flour: { quantity: 1, type: 'cup' },
      'olive oil': { quantity: 8, type: 'tbsp' },
      salt: { quantity: 1, type: 'tsp' },
      'tomato paste': { quantity: 1, type: 'can' },
      mushrooms: { quantity: 1, type: 'package' },
      prosciutto: { quantity: 4, type: 'slices' },
      gorgonzola: { quantity: 4, type: 'oz' },
      egg: { quantity: 1, type: 'egg' }
    },
    method: [
      'Preheat the oven to 200C/400F/Gas 6.',
      'For the pizza base, place the flour, oil, water and salt into a food processor and blend together until a dough is formed. Tip out onto a floured work surface and knead. Shape into a round base about 20cm/8in wide. ',
      'Place into a frying pan over a high heat and brown the base, then using a mini-blowtorch, crisp the top of the pizza. (Alternatively you can do this under the grill.) ',
      'For the topping, spread tomato purée over the top of the base. ',
      'Fry the mushrooms in a dry frying pan then scatter over the tomato purée. Arrange the prosciutto and cheese on top. ',
      'Crack an egg into the middle, then place into the oven for five minutes to finish cooking. ',
      'Serve on a large plate, and slice into wedges to serve.'
    ],
    url: 'www_bbc_com_food_recipes_10minutepizza_87314',
    title: 'Ten-minute pizza',
    time: {
      preparationMins: 30,
      cookingMins: 10,
      totalMins: 40
    },
    serves: 'Makes 1',
    isVegetarian: false,
    recommendations: 0
  }
};

//maps through json database and creates recipe nodes (run by seed function)
const recipeSeeder = async db => {
  try {
    await runQuery('MATCH (n) DETACH DELETE n');

    //check that recipe name is unique before creating the node
    //we are not sure why it works, but it works
    await runQuery(
      `CREATE CONSTRAINT ON (recipe:Recipe) ASSERT recipe.name IS UNIQUE`
    );
    await runQuery(
      `CREATE CONSTRAINT ON (ingredient:Ingredient) ASSERT ingredient.name IS UNIQUE`
    );
    // session.close();

    for (let recipe in db) {
      if (db.hasOwnProperty(recipe)) {
        const recipeObj = db[recipe];
        //create recipe node
        await runQuery(
          'MERGE (a:Recipe {name:$name, instructions:$instructions, time:$time, serves:$serves, image:$image}) RETURN a',
          {
            name: recipe, //string
            instructions: recipeObj.method, //array of strings
            time: recipeObj.time.totalMins, //string number
            serves: recipeObj.serves,
            image: recipeObj.image || '' //string
          }
        );
        const ingredientsObj = recipeObj.ingredients;
        for (let ingredient in ingredientsObj) {
          if (ingredientsObj.hasOwnProperty(ingredient)) {
            //create ingredient nodes that don't already exist
            await runQuery('MERGE (b:Ingredient {name:$name}) RETURN b', {
              name: ingredient
            });
            // session.close();

            //establish relationship between recipe and ingredient
            await runQuery(
              `MATCH (a:Recipe), (b:Ingredient)
            WHERE a.name = $aName AND b.name = $bName
            MERGE (a)-[r:hasIngredient {quantity: $quantity, type: $type} ]->(b) RETURN r`,
              {
                aName: recipe,
                bName: ingredient,
                quantity: ingredientsObj[ingredient].quantity,
                type: ingredientsObj[ingredient].type
              }
            );
            // session.close();
          }
        }
        const categoriesObj = recipeObj.categories;

        for (let category in categoriesObj) {
          if (categoriesObj.hasOwnProperty(category)) {
            await runQuery(
              `MERGE (a:Category {name: "${categoriesObj[category]}"})`
            );
            await runQuery(`MATCH (a:Recipe {name: "${recipe}"}), (b:Category {name: "${
              categoriesObj[category]
            }"})
				MERGE (a)-[:belongsToCategory]->(b)`);
          }
        }
        const cuisineObj = recipeObj.cuisine;
        for (let cuisine in cuisineObj) {
          console.log('we are in cuisine forloop', cuisineObj);
          if (cuisineObj.hasOwnProperty(cuisine)) {
            await runQuery(
              `MERGE (a:Cuisine {name: "${cuisineObj[cuisine]}"})`
            );
            await runQuery(`MATCH (a:Recipe {name: "${recipe}"}), (b:Cuisine {name: "${
              cuisineObj[cuisine]
            }"})
				MERGE (a) -[:belongsToCuisine]->(b)`);
          }
        }
        // session.close();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const listSeeder = async () => {
  console.log('seeding lists');
  //now that we have some seed data...lets seed a list for cody and 2 lists for murphy
  try {
    await runQuery(
      `MATCH (a:Person {name: $name}) CREATE (l:List {name: $listName, uuid: $uuid}) MERGE (a)-[:hasList{status: $status}]->(l) RETURN l`,
      {
        name: 'murphy@email.com',
        listName: 'Muphy List',
        uuid: '1111',
        status: 'primary'
      }
    );
    await runQuery(
      `MATCH (a:Person {name: $name}) CREATE (l:List {name: $listName, uuid: $uuid}) MERGE (a)-[:hasList{status: $status}]->(l) RETURN l`,
      {
        name: 'cody@email.com',
        listName: 'Cody List',
        uuid: '2222',
        status: 'primary'
      }
    );
    await runQuery(
      `MATCH (a:Person {name: $name}) CREATE (l:List {name: $listName, uuid: $uuid}) MERGE (a)-[:hasList{status: $status}]->(l) RETURN l`,
      {
        name: 'murphy@email.com',
        listName: 'Side Muphy List',
        uuid: '3333',
        status: 'inProgress'
      }
    );

    console.log('done seeding lists');

    console.log('adding recipes to list');
    //lets add a recipe to cody and murphys primary list
    // //add lemon curd ice cream to murphy primary list
    await runQuery(
      `MATCH (l:List {uuid: '1111'})
			MATCH(r:Recipe {name: 'Lemon curd ice cream'})
			MATCH (r)-[z:hasIngredient]->(i)
      MERGE (l)-[newIngredient:hasIngredient]->(i)
			MERGE (l)-[:hasRecipe]->(r)
			SET newIngredient += properties(z)
			`
    );
    await runQuery(
      `MATCH (l:List {uuid: '1111'})
			MATCH(r:Recipe {name: '15 minute pasta'})
			MATCH (r)-[z:hasIngredient]->(i)
      MERGE (l)-[newIngredient:hasIngredient]->(i)
			MERGE (l)-[:hasRecipe]->(r)
			SET newIngredient += properties(z)
			`
    );
    console.log('done recipes to list');

    //driver.close();
  } catch (err) {
    console.log(err);
  }
};

async function seed() {
  try {
    await db.sync({ force: true });
    console.log('db synced!');

    const users = await Promise.all([
      User.create({ email: 'cody@email.com', password: '123' }),
      User.create({ email: 'murphy@email.com', password: '123' })
    ]);
    let userArr = [];
    // Set # of users here
    for (let i = 0; i <= 15; i++) {
      let name = random.first();
      name += '@email.com';
      userArr.push(User.create({ email: name, password: '123' }));
    }
    await Promise.all(userArr);
    console.log(`seeded ${users.length} users`);
    console.log(`seeded successfully`);
    await runQuery(
      // CHANGE random num for more frequent likes
      `match (r:Recipe) with collect(r) as recipes match (p:Person) with collect(p) as users, recipes unwind users as x unwind recipes as y foreach (ignoreme in case when rand() < .2 then [1] else [] end | merge (x)-[:HAS_FAVORITE]->(y))`
    );
    await runQuery(
      // CHANGE random num for more frequent likes
      `match (r:Recipe) with collect(r) as recipes match (p:Person) with collect(p) as users, recipes unwind users as x unwind recipes as y foreach (ignoreme in case when rand() < .3 then [1] else [] end | merge (x)-[:HAS_VIEWED]->(y))`
    );
  } catch (err) {
    console.log(err);
  }
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...');
  try {
    //neo4j deleting all nodes before run seed --------------------------------------------
    await recipeSeeder(database);
    await seed();
    await listSeeder();
    //await session.close();
    await driver.close();
    console.log('done');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();

    console.log('db connection closed');
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
