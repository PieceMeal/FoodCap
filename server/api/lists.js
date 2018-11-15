const router = require('express').Router()
const {User} = require('../db/models')
const {createUser} = require('../utils/createUsers')
const {session, driver} = require('../db/neo')
const uuidv1 = require('uuid/v1')

module.exports = router

//POST (/api/lists)
//expects: req.body.listName
//creates a list node that is has a relationship to
//req.user.uuid
router.post('/', async (req, res, next) => {
  try {
    const {listName} = req.body
    const {records} = await session.run(
      `MATCH (a:Person {uuid: '${
        req.user.uuid
      }'}) CREATE (l:List {name:'${listName}', uuid: '${uuidv1()}'}) MERGE (a)-[:HAS_LIST{status:'IN_DEVELOPMENT'}]->(l) RETURN l`
    )
    console.log(records)
    session.close()

    res.json(records[0].get('l'))
  } catch (err) {
    next(err)
  }
})

//GET (/api/lists)
//expects: nothing required
//returns the current logged in user (req.user)'s lists
router.get('/', async (req, res, next) => {
  try {
    const {records} = await session.run(
      `MATCH (a:Person {uuid: '${
        req.user.uuid
      }'})-[:HAS_LIST]-(l:List) RETURN l`
    )

    session.close()
    res.json(records)
  } catch (err) {
    next(err)
  }
})

//PUT (/api/lists/favorite)
//expects: req.body.uuid to match the uuic of list
router.put('/favorite', async (req, res, next) => {
  try {
    const {uuid} = req.body
    console.log('in route ')
    console.log(req.body)

    const {records} = await session.run(
      `MATCH (a:Person {uuid: '${
        req.user.uuid
      }'}) MATCH(l:List {uuid: '${uuid}'}) MERGE (a)-[r:IS_FAVORITE]->(l) RETURN r`
    )
    session.close()
    console.log()
    res.json({relationship: records[0].get('r').type})
  } catch (err) {
    next(err)
  }
})
