require("dotenv").config();
const { ApolloServer } = require("apollo-server");
require("./db");
const { typeDefs } = require("./Schema/schema");
const { resolvers } = require("./Resolvers/resolver");
const { verifyToken, createToken } = require("./helpers/Auth");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization;
    const arr = token.split(" ");
    let user;
    if (arr[0] === "Bearer" && arr[1]) {
      user = await verifyToken(arr[1]);
    }
    return { user, createToken };
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
