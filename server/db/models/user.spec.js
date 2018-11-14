/* global describe beforeEach it */

const {expect} = require('chai')
const db = require('../index')
const User = db.model('user')
const {session, driver} = require('../neo')

describe('User model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let cody

      beforeEach(async () => {
        cody = await User.create({
          email: 'cody@puppybook.com',
          password: 'bones'
        })
      })

      it('returns true if the password is correct', () => {
        expect(cody.correctPassword('bones')).to.be.equal(true)
      })

      it('returns false if the password is incorrect', () => {
        expect(cody.correctPassword('bonez')).to.be.equal(false)
      })
    }) // end describe('correctPassword')
  }) // end describe('instanceMethods')

  describe('Neo4j Implementation', () => {
    let cody

    beforeEach(async () => {
      cody = await User.create({
        email: 'cody@puppybook.com',
        password: 'bones'
      })
    })

    it('creates a uuid for each user', () => {
      expect(cody.uuid.length).to.be.greaterThan(0)
    })

    it('creates a Neo4j node w/ matching uuid', async () => {
      const testuuid = cody.uuid

      const {records} = await session.run(
        'MATCH (a:Person {uuid: $uuid}) RETURN a.uuid',
        {
          uuid: testuuid
        }
      )
      expect(testuuid).to.be.equal(records[0].get('a.uuid'))
      // .then(result => {
      //   expect(testuuid).to.be.equal(result.records[0].get(0).properties.uuid)
      session.close()

      driver.close()
    })
    /*
      session
    .run('CREATE (a:Person {uuid: $uuid, name:$name}) RETURN a', {
      uuid: user.uuid,
      name: user.email.slice(0, 6)
    })
    .then(result => {
      session.close()

      const singleRecord = result.records[0]
      const node = singleRecord.get(0)

      // on application exit:
      driver.close()
      */
  }) // end describe('correctPassword')
}) // end describe('User model')
