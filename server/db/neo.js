const neo4j = require('neo4j-driver').v1;

const graphenedbURL = process.env.GRAPHENEDB_BOLT_URL || 'bolt://localhost';
const graphenedbUser = process.env.GRAPHENEDB_BOLT_USER || 'neo4j';
const graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD || '1234';

const driver = neo4j.driver(
	graphenedbURL,
	neo4j.auth.basic(graphenedbUser, graphenedbPass)
);

//const session = driver.session();

async function runQuery(cypher, params = {}) {
	const session = driver.session();

	try {
		const results = await session.run(cypher, params);
		session.close();
		return results;
	} catch (error) {
		session.close();
		throw error;
	}
}
module.exports = { driver, runQuery };
