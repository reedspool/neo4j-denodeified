# Node-Neo4j and q
[node-neo4j](https://github.com/thingdom/node-neo4j) is a great project for using the kick-ass [neo4j database](http://www.neo4j.org/) with [node](http://nodejs.org/).

The node-neo4j project uses some wacky async interface which I've never seen, though I'm sure that it's perfectly normal and that I'm just living under a rock. I like to use the [q async package](https://github.com/kriskowal/q), so I made this package. I've made it mostly with me in mind.

I've used the [Proxy pattern](http://en.wikipedia.org/wiki/Proxy_pattern) and [Q.nbind()](https://github.com/kriskowal/q/wiki/API-Reference) to maintain node-neo4j's complete interface [leaving out all the callback parameters].