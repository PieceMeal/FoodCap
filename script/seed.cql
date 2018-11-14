const neo4j = require('neo4j-driver').v1
const database = require('./db.json')
const { session, driver } = require('../server/db/neo')

//don't know what this is doing
session.run(`MATCH (n) detach delete n`)

//check that recipe name is unique
session.run(`CREATE CONSTRAINT ON (recipe:Recipe) ASSERT recipe.name IS UNIQUE`)

session.run(`CREATE )

