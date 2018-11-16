const router = require('express').Router()
const User = require('../db/models/user')
const {runQuery, driver} = require('../db/neo')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({where: {email: req.body.email}})
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      let uuid = user.uuid
      let recipes = await runQuery(
        `MATCH(r:Recipe) -[:hasIngredient]-> (i:Ingredient),
        (i) <-[:like] - (a: Person {uuid: $uuid})
        RETURN r`, {
          uuid: uuid
        }
      )
      const recipesArray =[]
      recipes.records.forEach((rec, i) => {
        const props = rec.get('r').properties
        recipesArray[i]= {}
        for(let key in props) {
          recipesArray[i][key] = props[key]
        }
      })
      console.log('we are sending information back')
      req.login(user, err => (err ? next(err) : res.json({user: user, recipes: recipesArray})))
    }
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  console.log('is this a problem??? req.user', req.user);
  res.json(req.user)
})

router.use('/google', require('./google'))
