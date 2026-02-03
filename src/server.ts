import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { userTypeDefs } from './graphql/typeDefs/userTypeDefs';
import { userResolvers } from './graphql/resolvers/userResolver';

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs: [userTypeDefs],
    resolvers: [userResolvers],
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use('/graphql', expressMiddleware(server));
  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startApolloServer().catch((error) => {
  console.error('Failed to start the server:', error);
});
