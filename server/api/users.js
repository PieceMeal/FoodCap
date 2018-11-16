const router = require('express').Router()
const {User} = require('../db/models')
const { runQuery, driver} = require('../db/neo')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})
router.get('/:userId', async (req, res, next) => {
  try {
    let id = req.params.userId
    let user = await User.findById(id)
    let uuid = user.uuid;
    let recipes = await runQuery(
      `MATCH (r:Recipe) -[:hasIngredient] -> (i:Ingredient),
      (i) <- [:like] - (a: Person {uuid: $uuid})
      Return r
      `,{uuid: uuid}
    )
    const recipesArray =[]
    recipes.records.forEach((rec, i) => {
      const props = rec.get('r').properties
      recipesArray[i]= {}
      for(let key in props) {
        recipesArray[i][key] = props[key]
      }
    })

    res.json(recipesArray)
  } catch (err) {
    next(err)
  }
})
router.put('/:userId',async (req, res, next) => {
  try{
    let ingName = req.body.preferences
    let userId = req.params.userId
    let user = await User.findById(userId);
    let uuid = user.uuid;

    await runQuery(
      `MATCH (a:Person), (b: Ingredient) 
       WHERE a.uuid = $uuid AND b.name = $ingName
       MERGE (a) -[r:like]->(b)
       RETURN r`,
       {uuid: uuid, ingName: ingName}
       )
      //getting the favorite food using the like connection with ingredients
    let recipes = await runQuery(
      `MATCH (r:Recipe) -[:hasIngredient] -> (i:Ingredient),
      (i) <- [:like] - (a: Person {uuid: $uuid})
      Return r
      `,{uuid: uuid}
    )
    //recipe object with properties name, instruction(arr) and time
    const recipesArray =[]
    recipes.records.forEach((rec, i) => {
      const props = rec.get('r').properties
      recipesArray[i]= {}
      for(let key in props) {
        recipesArray[i][key] = props[key]
      }
    })

    //query to get all the ingredients from the recipe above 
    // const ingredients = await session.run(
    //   `MATCH (r:Recipe {name: $name}) -[:hasIngredient] - (i:Ingredient)
    //   RETURN i`,
    //   {name: recipe.name}
    // )
    //mapping over the results of the query and taking the name's of ing into arr.
    // let ingredientsArray = ingredients.records.map( item => item.get('i').properties.name)

    session.close()
    let updatedUser = await user.update({
      formFilled: true
    })

    res.json({user: updatedUser, recipes: recipesArray})
  }catch(err){
    next(err)
  }
})

