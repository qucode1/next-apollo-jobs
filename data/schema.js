const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Query {
    user(id: String, firstName: String, lastName: String, email: String): User
    allUsers: [User]
    job(id: String): Job
    jobs(title: String, location: String): [Job]
    allJobs: [Job]
    nearbyJobs(lng: Float!, lat: Float!, distance: Int, order: Int): [nearbyJob]
  }
  type nearbyJob {
    distance: Float,
    job: Job
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
    locations: [LocationRef]
  }
  type Loc {
    type: String
    coordinates: [Float]
    address: String
  }
  type Location {
    id: String
    category: String
    user: String
    job: String
    loc: Loc
  }
  type LocationRef {
    address: String
    data: Location
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