import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from "graphql";
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';

/*
    type Query {
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
*/

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'query',
        fields: {
            rollDice: {
                type: new GraphQLList(GraphQLFloat),
                args: {
                    numDice: { type: new GraphQLNonNull(GraphQLInt) },
                    numSides: { type: GraphQLInt }
                },
                resolve: (_, { numDice, numSides }) => {
                    const output = [];
                    for (let i = 0; i < numDice; i++) {
                        output.push(Math.floor(Math.random() * numSides) + 1);
                    }
                    return output;
                }
            }
        }
    })
});



const app = express();

app.all("/graphql", createHandler({ schema }));

app.listen(4000);
console.log("Server is running on port 4000");


// Serve the GraphiQL IDE.
app.get('/', (_req, res) => {
    res.type('html');
    res.end(ruruHTML({ endpoint: '/graphql' }));
});

/**
 * call:
 * { rollDice(numSides: 6, numDice:3) }
 */