import express from "express";
import authRoutes from "./routes/auth.route";
import sequelize from "./models/index";
import paymentRoutes from "./routes/payment.route";
import expressWinston from "express-winston";
import logger from "./utils/logger";
import demoRoutes from "./routes/demo.route";
import typeDefs from "./graphql/schema";
import dotenv from "dotenv";
dotenv.config();
import resolvers from "./graphql/resolve";
import { ApolloServer } from "apollo-server-express";
// const { graphqlUploadExpress } = require("graphql-upload");

// Create an instance of ApolloServer
const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
const port = 3000;

async function startServer() {
  //payment webhook
  app.use("/api", paymentRoutes);

  // GraphQL endpoint
  // app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  await server.start();
  server.applyMiddleware({ app });

  app.use(express.json());

  //app routes
  app.get("/", (req, res) => {
    res.send("My World!");
  });

  app.use("/api", demoRoutes);
  app.use("/api", authRoutes);

  //error handling
  app.use(
    expressWinston.errorLogger({
      winstonInstance: logger,
    })
  );
  sequelize
    .sync()
    .then(() => {
      app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port} `);
      });
    })
    .catch((err: unknown) => {
      logger.error("Unable to connect to the database:", err);
    });
}
startServer();
