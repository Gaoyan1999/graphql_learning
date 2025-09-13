import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
 
// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
type RandomDie {
  numSides: Int!
  rollOnce: Int!
  roll(numRolls: Int!): [Int]
}
 
type Query {
  getDie(numSides: Int): RandomDie
}
`);
 
// This class implements the RandomDie GraphQL type
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }
 
  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }
 
  roll({ numRolls }) {
    const output = [];
    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}
 
// The root provides the top-level API endpoints
const root = {
  getDie({ numSides }) {
    return new RandomDie(numSides || 6);
  },
};
 
const app = express();
app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');