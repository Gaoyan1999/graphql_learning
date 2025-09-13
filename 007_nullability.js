import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
} from 'graphql';
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) }
    }
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: UserType,
            resolve: () => ({ id: null }),
        },
    },
});


const schema = new GraphQLSchema({ query: QueryType });

const app = express();
app.use('/graphql', createHandler({ schema }));
app.listen(4000);
console.log('Server is running on port 4000');

app.get('/', (_req, res) => {
    res.type('html');
    res.end(ruruHTML({ endpoint: '/graphql' }));
});
