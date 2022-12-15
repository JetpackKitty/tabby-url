import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/schemasMap';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const startServer = async () => {
  app.get('/', (req, res) => {
    res.send('TabbyUrl is running');
  });

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      if (req.headers.authorization) {
        // In real life, this portion of code
        // would be proper authentication validation
        return { isAuthenticated: true };
      }

      return { isAuthenticated: false };
    },
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  const port = process.env.SERVER_PORT || 5500;
  app.listen(port, () => {
    console.log(`TabbyUrl is running on port ${port}`);
  });
};

startServer();

export default app;
