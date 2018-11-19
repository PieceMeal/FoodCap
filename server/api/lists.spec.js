// /* global describe beforeEach it */

// const { expect } = require('chai');
// const request = require('supertest');
// const db = require('../db');
// const app = require('../index');
// const User = db.model('user');
// const { runQuery, driver } = require('../db/neo');
// const { createUser } = require('../utils/createUsers');
// describe('List routes', () => {
// 	beforeEach(async () => {
// 		await db.sync({ force: true });
// 		await runQuery('MATCH (n) detach delete n');
// 	});

// 	describe('/api/lists/', () => {
// 		it('POST /api/lists creates a list with given name and associates it with user', async () => {
// 			const user = await createUser('user@user.com');
// 			const res = await user
// 				.post('/api/lists')
// 				.send({ listName: 'My Testing List :D' })
// 				.expect(200);

// 			expect(res.body.properties.name).to.be.equal('My Testing List :D');
// 		});

// 		it('GET /api/lists returns one list for a user if they have 1 list', async () => {
// 			const user = await createUser('user@user.com');
// 			await user
// 				.post('/api/lists')
// 				.send({ listName: 'My Testing List :D' })
// 				.expect(200);
// 			const res = await user.get('/api/lists').expect(200);
// 			console.log(res.body);
// 			expect(res.body.length).to.be.equal(1);
// 		});

// 		it('GET /api/lists returns two lists for a user if they have 2 lists', async () => {
// 			console.log('test');
// 			const user = await createUser('user@user.com');
// 			await user
// 				.post('/api/lists')
// 				.send({ listName: 'My Testing List :D' })
// 				.expect(200);
// 			await user
// 				.post('/api/lists')
// 				.send({ listName: 'My 2nd Testing List :D' })
// 				.expect(200);
// 			const res = await user.get('/api/lists').expect(200);
// 			console.log(res.body);
// 			expect(res.body.length).to.be.equal(2);
// 		});

// 		it('PUT /api/lists/favorite creates an edge between logged in user and given list by uuid', async () => {
// 			const user = await createUser('user@user.com');
// 			const { body } = await user
// 				.post('/api/lists')
// 				.send({ listName: 'My Testing List :D' });
// 			const uuid = body.properties.uuid;

// 			const res = await user.put('/api/lists/favorite').send({ uuid });
// 			console.log(res.body);
// 			expect(res.body.relationship).to.be.equal('isFavorite');
// 		});
// 	}); // end describe('/api/users')
// }); // end describe('User routes')
