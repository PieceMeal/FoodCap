const database = require('./db.json')

const dbParser = db => {
  for (let key in db) {
    const recipeName = key
    const ingredientArray = db[key]["ingredients"]
    const directionsArray = db[key]["method"]
    const time = db[key]["time"]["totalMins"]
    const servingSize = db[key]["serves"]
    const vegBool = db[key]["isVegetarian"]
    // write node creators using key/val info here
  }
}

dbParser(database)
