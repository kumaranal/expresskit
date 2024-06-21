import express from "express";
import authRoutes from "./routes/auth.route";
import sequelize from "./models/index";
import paymentRoutes from "./routes/payment.route";
import expressWinston from "express-winston";
import logger from "./utils/logger";
import demoRoutes from "./routes/demo.route";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphqlHTTP } from "express-graphql";
import resolvers from "./graphql/resolve";
import typeDefs from "./graphql/schema";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

//payment webhook
app.use("/api", paymentRoutes);

app.use(express.json());

//app routes
app.get("/", (req, res) => {
  res.send("My World!");
});

app.use("/api", demoRoutes);
app.use("/api", authRoutes);

// Create the executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });
// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

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
      logger.info(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err: unknown) => {
    logger.error("Unable to connect to the database:", err);
  });
