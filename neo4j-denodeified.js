 /*
 * neo4j-denodeified
 *
 * Offer a 'neo4j' interface which is
 * "denodeified" into Q promise land. 
 * Current phase: Proof of concept, 
 * hacking onto method of neo4j
 *
 * Requirements: q, neo4j, underscore
 *
 * Sample useage:
 *
 * var neo4j = require('./neo4j-denodeified')
 *
 * var db = neo4j.connect('http://localhost:7474/')
 *
 * var node = db.createNode({ hello: 'world' })
 *
 * node.save()
 *     .then(function (node) { 
 *        // do something with node
 *     });
 *
 *
 *
 * Author: Reed Spool
 *
 * License: Beer License
 *
 * Beer License:
 *   The code is yours. Fork, create, steal, pull request. 
 *   Keep my name with it, and add yours.
 *   If you meet me, I hope you will offer me a beer to 
 *   talk about it. I'll refuse, and let you buy me a 
 *   Whiskey Ginger intead.
 */
var Q = require('q');
var neo4j = require('neo4j');
var _ = require('underscore');

function proxyNeo4j() {
	neo4j.connect = proxyConnect.bind(neo4j);

	return neo4j;
}

function proxyConnect(url) {
	var db = new this.GraphDatabase(url);

	proxyCreateNode(db);

	return db;
}

function proxyCreateNode(db) {
	db.__proxied__createNode = db.createNode;
	
	db.createNode = function () {
		var node = db.__proxied__createNode.apply(db, arguments);

		node.save = Q.nbind(node.save, node);

		return node;
	}
}

module.exports = proxyNeo4j();
