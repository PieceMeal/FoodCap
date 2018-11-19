const db = require('../db');
const app = require('../index');
const User = db.model('user');
const request = require('supertest');

// const createAuthUser = async email => {
//   //create a user that is in the DB that is an admin
//   try {
//     await User.create({
//       email,
//       password: 'test',
//       isAdmin: true
//     })

//     //crete user and connect to our express app
//     const authUser = request.agent(app)

//     //log the user in
//     await authUser.post('/auth/login').send({email, password: 'test'})
//     return authUser
//   } catch (err) {
//     console.error(err)
//   }
// }

const createUser = async email => {
	//create a user that is in the DB that is an admin
	try {
		console.log('create user');
		await User.create({
			email,
			password: 'test',
		});

		//crete user and connect to our express app
		const notAuthUser = request.agent(app);

		//log the user in
		await notAuthUser.post('/auth/login').send({ email, password: 'test' });
		return notAuthUser;
	} catch (err) {
		console.error(err);
	}
};

// const createUserWithCart = async email => {
//   try {
//     const user = await User.create({
//       email,
//       password: 'test',
//       isAdmin: true
//     })
//     await Cart.create({
//       products: [{id: 1, quantity: 2}, {id: 2, quantity: 2}],
//       userId: user.id
//     })
//     //crete user and connect to our express app
//     const userWithCart = request.agent(app)

//     //log the user in
//     await userWithCart.post('/auth/login').send({email, password: 'test'})
//     return userWithCart
//   } catch (err) {
//     console.error(err)
//   }
// }

// const createUserWithNoCart = async email => {
//   try {
//     const user = await User.create({
//       email,
//       password: 'test',
//       isAdmin: true
//     })

//     //crete user and connect to our express app
//     const userWithoutCart = request.agent(app)

//     //log the user in
//     await userWithoutCart.post('/auth/login').send({email, password: 'test'})
//     return userWithoutCart
//   } catch (err) {
//     console.error(err)
//   }
// }

module.exports = {
	createUser,
};
