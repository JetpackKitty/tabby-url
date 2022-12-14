import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/schemasMap';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const startServer = async () => {
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(5500, () => {
    console.log('Server is running on port 5500');
  });
};

startServer();

export default app;
