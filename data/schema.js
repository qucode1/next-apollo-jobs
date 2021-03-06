const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Query {
    me: Me
    user(id: String, firstName: String, lastName: String, email: String, accessToken: String, oAuth: String): User
    allUsers: [User]
    job(id: String): Job
    jobs(title: String, location: String): [Job]
    allJobs: [Job]
    nearbyJobs(lng: Float!, lat: Float!, distance: Int, order: Int): [nearbyJob]
    nearbyUsers(lng: Float!, lat: Float!, distance: Int, order: Int): [nearbyUser]
  }
  type Me {
    id: String
    firstName: String
    lastName: String
    email: String
    oAuth: String
    role: String
    location: LocationRef
    profileToken: String
    publicKey: String
  }
  type User {
    id: String
    firstName: String
    lastName: String
    email: String
    oAuth: String
    role: String
    location: LocationRef
  }
  type nearbyUser {
    distance: Float,
    user: User
  }
  type Job {
    id: String
    title: String
    description: String
    locations: [LocationRef]
  }
  type nearbyJob {
    distance: Float,
    job: Job
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
  input UserInput {
    firstName: String!
    lastName: String
    email: String!
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
    createUser(input: UserInput!, location: LocationInput!): User
    createJob(input: JobInput!, locations: [LocationInput!]!): Job
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;