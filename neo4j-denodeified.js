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
	proxyGetIndexedNode(db);

	return db;
}

// Refactor me and my bro downstairs!
function proxyCreateNode(db) {
	db.__proxied__createNode = db.createNode;

	db.createNode = function () {
		var node = db.__proxied__createNode.apply(db, arguments);

		return proxyNode(node);
	}
}

function proxyGetIndexedNode(db) {
	db.__proxied__getIndexedNode = db.getIndexedNode;

	db.getIndexedNode = function (property, value) {
		var index = 'node_auto_index';
		var deferred = Q.defer();
		var callback = deferred.makeNodeResolver();
		
		db.__proxied__getIndexedNode(index, property, value, callback);

		return deferred.promise
			.then(proxyNode);
	}
}


function proxyNode(node) {
	if ( ! node) return node;

	var callback_methods = [
		'save', 'delete', 'index', 'unindex', 
		'createRelationshipTo', 'createRelationshipFrom',
		'getRelationships', 'outgoing',
		'incoming', 'all', 'getRelationshipNodes',
		'path'
	];


	_.each(callback_methods, function (method) {
		node[method] = Q.nbind(node[method], node);
	});

	return node;
}

module.exports = proxyNeo4j();
