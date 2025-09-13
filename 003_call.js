let dice = 3;
let sides = 6;
let query = /* GraphQL */ `
  query RollDice($dice: Int!, $sides: Int) {
    rollDice(numDice: $dice, numSides: $sides)
  }
`;
 
fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: { dice, sides },
  }),
})
  .then((r) => r.json())
  .then((data) => console.log('data returned:', data));