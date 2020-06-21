const { gql } = require("apollo-server");

const typeDefs = gql`
  type Category {
    id: ID!
    name: String!
  }

  input categoryInput {
    id: ID
    name: String
  }

  type Product {
    id: ID
    name: String
    description: String
    price: Int
    discount: Int
    amountToPay: Int
    category: Category
    productImage: String
    store: Store
    createdAt: String
    updatedAt: String
  }

  input productInput {
    id: ID
    name: String
    description: String
    price: Int
    discount: Int
    amountToPay: Int
    category: categoryInput
    productImage: String
    store: storeInput
    createdAt: String
    updatedAt: String
  }

  type Store {
    id: ID!
    name: String!
    storeOpen: Boolean
    owner: User!
    address: Address
    createdAt: String
    updatedAt: String
  }

  input storeInput {
    id: ID
    name: String
    storeOpen: Boolean
    owner: UserInput
    address: addressInput
    createdAt: String
    updatedAt: String
  }

  type Address {
    id: ID!
    street: String!
    house: String!
    zip: String!
    city: String!
    state: String!
  }

  input addressInput {
    street: String!
    house: String!
    zip: String!
    city: String!
    state: String
  }

  type Order {
    id: ID!
    userId: User
    products: [Product]
    status: String
    orderAmount: Int
    shippingAddress: Address
    createdAt: String
    updatedAt: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    role: String
    createdAt: String
    updatedAt: String
    address: Address
  }

  input UserInput {
    username: String!
    password: String!
    email: String!
    firstName: String!
    lastName: String!
    role: String
    address: addressInput
    createdAt: String
    updatedAt: String
  }

  type AuthUser {
    token: String!
    user: User!
  }

  type Query {
    users: [User]
    me: User
    stores: [Store]
    products: [Product]
    categories: [Category]
    allOrders: [Order]
    userOrders: [Order]
  }

  type Mutation {
    signup(input: UserInput): User
    login(username: String, password: String): AuthUser
    createStore(input: storeInput, ownerID: ID): Boolean
    updateStore(input: storeInput, id: ID, address: addressInput): Store
    searchStore(name: String): [Store]
    createProduct(input: productInput, storeID: ID!): Boolean
    searchProduct(name: String): [Product]
    updateProduct(input: productInput, id: ID): Product
    createOrder(userID: ID, products: [productInput]): Boolean
    updateOrder(id: ID, status: String): Order
  }
`;

module.exports = {
  typeDefs,
};
