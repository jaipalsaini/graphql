const express = require('express');
const cors = require('cors');
const schema = require('./schema');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {ApolloServer} = require('apollo-server-express');


const url = 'mongodb://localhost:27017/moviesdb';

const connect = mongoose.connect(url, {useNewUrlParser: true});

connect.then((db) => {
    console.log("connected correctly to server!");
});

async function startApollo(){
    const server = new ApolloServer({
        typeDefs: schema.typeDefs,
        resolvers: schema.resolvers
    });

    await server.start();
    const app = express();
    app.use(bodyParser.json());
    app.use('*', cors());
    server.applyMiddleware({
        app
    });

    await new Promise(resolve => app.listen({
            port: 4000
        }, () =>
        console.log(`server ready at http://localhost:4000${server.graphqlPath}`)
    ));
    return { server, app };
}
startApollo();
