// npm packages
require("dotenv").config()

const next = require('next');
const bodyParser = require('body-parser');
const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

// our packages
const schema = require('./data/schema');

// next.js setup
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use('/graphql', bodyParser.json(), graphqlExpress(req => ({
        schema,
        context: {
            accessToken: req.headers.access_token,
            profileToken: req.headers.profile_token
        }
    })));
    server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});