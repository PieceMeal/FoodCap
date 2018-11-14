const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')
let {session, driver} = require('../neo')
const uuidv1 = require('uuid/v1')
const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  googleId: {
    type: Sequelize.STRING
  }, 
  uuid : {
    type : Sequelize.STRING,
    allowNull: false,
    defaultValue: uuidv1
  }
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

/**
 * classMethods
 */
User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

const createNeoUser = user => {
  //write a query for creting a user with uuid
  session.run(
    'CREATE (a:Person {uuid: $uuid, name:$name}) RETURN a',
    {uuid: user.uuid, name: user.email.slice(0,6)}
  ).then(result => {
    session.close();
  
    const singleRecord = result.records[0];
    const node = singleRecord.get(0);
  
    console.log('we are getting here with ', node);
  
    // on application exit:
    driver.close();
  });
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.afterCreate(createNeoUser)