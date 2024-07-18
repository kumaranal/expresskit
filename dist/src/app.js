"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const index_1 = __importDefault(require("./models/index"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const logger_1 = __importDefault(require("./utils/logger"));
const demo_route_1 = __importDefault(require("./routes/demo.route"));
const schema_1 = __importDefault(require("./graphql/schema"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const index_2 = __importDefault(require("./graphql/resolvers/index"));
const apollo_server_express_1 = require("apollo-server-express");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const jwtCheck_1 = require("./middleware/jwtCheck");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const customError_1 = require("./utils/customError");
const user_route_1 = __importDefault(require("./routes/user.route"));
const aiTranslator_route_1 = __importDefault(require("./routes/aiTranslator.route"));
// import graphqlUploadExpress from "graphql-upload/GraphQLUpload.mjs";
// import { AppoloServerPluginDrainHttpServer } from "apollo-server-core";
const cors_1 = __importDefault(require("cors"));
const ws_1 = __importDefault(require("ws"));
const chatbot_route_1 = __importDefault(require("./routes/chatbot.route"));
// Create an instance of ApolloServer
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: schema_1.default,
    resolvers: index_2.default,
    context: ({ req, res }) => {
        const token = req.cookies.accessToken;
        let user = null;
        try {
            if (!token) {
                throw (0, customError_1.createCustomError)("Invalid Token");
            }
            user = (0, jwtCheck_1.getUserFromToken)(token);
        }
        catch (error) {
            logger_1.default.error("error occures", { error: error });
        }
        return { user, req, res };
    },
});
const app = (0, express_1.default)();
const port = 3000;
// app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
const allowedOrigins = [
    "http://localhost:3002",
    "http://localhost:3001",
    "http://localhost:3000",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Reflect the request's credentials as necessary
    methods: ["GET", "PUT", "POST", "DELETE"],
}));
app.options("*", (0, cors_1.default)());
const wss = new ws_1.default.Server({ port: 3001 });
//payment webhook
app.use("/api", payment_route_1.default);
app.use("/api", chatbot_route_1.default);
wss.on("connection", function connection(ws) {
    ws.send("Welcome New Client!");
    ws.on("message", function incoming(message) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === ws_1.default.OPEN) {
                client.send(message);
            }
        });
    });
});
//rate limiter
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//app routes
app.get("/", (req, res) => {
    res.send("My World!");
});
app.use("/api", demo_route_1.default);
app.use("/api", auth_route_1.default);
app.use("/api", user_route_1.default);
app.use("/api", aiTranslator_route_1.default);
async function startServer() {
    //error handling
    app.use(errorHandler_1.default);
    // GraphQL endpoint
    await server.start();
    server.applyMiddleware({
        app,
        path: "/graphql",
    });
    // Catch 404 and forward to error handler
    app.use((req, res, next) => {
        const error = new Error("API not found");
        next(error);
    });
    index_1.default
        .sync()
        .then(() => {
        app.listen(port, () => {
            logger_1.default.info(`Server is running on http://localhost:${port} & for graphql use http://localhost:${port}/graphql`);
        });
    })
        .catch((err) => {
        logger_1.default.error("Unable to connect to the database:", err);
    });
}
startServer();
