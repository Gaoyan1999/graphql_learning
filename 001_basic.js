import { graphql, buildSchema } from 'graphql';

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
    type User {
    id: ID!
    name: String
    email: String
    }

    type Query {
    user: User
    }    
    `);
const defaultUser = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
};
// The rootValue provides a resolver function for each API endpoint
const rootValue = {
    user: () => defaultUser,
};

// Run the GraphQL query '{ hello }' and print out the response
graphql({
    schema,
    source: '{ user { name } }',
    rootValue,
}).then((response) => {
    console.log(response);
});
