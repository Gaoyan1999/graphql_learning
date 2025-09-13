import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import { ruruHTML } from 'ruru/server';


const fakeDatabase = {};
class Message {
    constructor(id, { content, author }) {
        this.id = id;
        this.content = content;
        this.author = author;
    }
}

const root = {
    getMessage({ id }) {
        return fakeDatabase[id];
    },
    getMessages() {
        return Object.values(fakeDatabase);
    },
    createMessage: ({ input }) => {
        console.log('createMessage', input);
        const id = String(Object.keys(fakeDatabase).length + 1);
        const message = new Message(id, input);
        fakeDatabase[id] = message;
        return message;
    },
    updateMessage: ({ id, input }) => {
        if (!fakeDatabase[id]) {
            throw new Error(`Message with id ${id} not found`);
        }
        fakeDatabase[id] = new Message(id, input);
        return fakeDatabase[id];
    },
};

const schema = buildSchema(`
    input MessageInput {
        content: String,
        author: String,
    }

    type Message {
        id: ID!
        content: String
        author: String
    }
    
    type Query {
        getMessage(id: ID!): Message
        getMessages: [Message]
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }
`);


const app = express();
app.use('/graphql', createHandler({ schema, rootValue: root }));
app.listen(4000);
console.log('Server is running on port 4000');

app.get('/', (_req, res) => {
    res.type('html');
    res.end(ruruHTML({ endpoint: '/graphql' }));
});
