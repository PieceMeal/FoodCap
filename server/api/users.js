const router = require('express').Router()
const {User} = require('../db/models')
const {session, driver} = require('../db/neo')
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
router.put('/:userId',async (req, res, next) => {
  try{
    console.log('we got here----', req.body)
    let ingName = req.body.preferences
    let userId = req.params.userId
    console.log('user id____', userId)
    let user = await User.findById(userId);
    let uuid = user.uuid;
    console.log('uuid', uuid)
    console.log('ingName', ingName);
    
    await session.run(
      `MATCH (a:Person), (b: Ingredient) 
       WHERE a.uuid = $uuid AND b.name = $ingName
       MERGE (a) -[r:like]->(b)
       RETURN r`,
       {uuid: uuid, ingName: ingName}
       )
    session.close()
    let updatedUser = await user.update({
      formFilled: true
    })

    res.json({user: updatedUser, text: 'we updated user with new preferences'})
  }catch(err){
    next(err)
  }
} )
