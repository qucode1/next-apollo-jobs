const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Query {
    user(id: String, firstName: String, lastName: String, email: String): User
    allUsers: [User]
    job(id: String): Job
    jobs(title: String, location: String): [Job]
    allJobs: [Job]
  }
  type User {
    id: String
    firstName: String
    lastName: String
    email: String
  }
  input UserInput {
    firstName: String!
    lastName: String
    email: String!
  }
  type Job {
    id: String
    title: String
    description: String
    locations: [Location]
  }
  type Location {
    type: String!
    coordinates: [Float]
    address: String
  }
  input LocationInput {
    coordinates: [Float!]!
    address: String!
  }
  input JobInput {
    title: String!
    description: String!
  }
  type Mutation {
    createUser(input: UserInput!): User
    createJob(input: JobInput!, locations: [LocationInput!]!): Job
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;