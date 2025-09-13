import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import { ruruHTML } from 'ruru/server';


const schema = buildSchema(`type Query { ip: String }`);

const root = {
    ip: () => {
        return request.ip;
    }
}


function loggingMiddleware(req, res, next) {
    console.log('ip:', req.ip);
    next();
}

const app = express();
app.use(loggingMiddleware);
app.all("/graphql", createHandler({ schema, root, context: (req) => ({ ip: req.raw.ip }) }));
app.listen(4000);


app.get('/', (_req, res) => {
    res.type('html');
    res.end(ruruHTML({ endpoint: '/graphql' }));
});
