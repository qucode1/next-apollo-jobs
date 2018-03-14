const mongoose = require('mongoose');
const { User, Job, Location } = require('./mongodb');
var jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');
const { promisify } = require("util")

const isAuthenticated = async (accessToken) => {
    try {
        const { header: { kid } } = await jwt.decode(accessToken, { complete: true })
        const client = jwksRsa({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 10,
            jwksUri: `https://next-graphql.eu.auth0.com/.well-known/jwks.json`
        })
        const getSigningKey = promisify(client.getSigningKey)
        const { publicKey, rsaPublicKey } = await getSigningKey(kid)

        const decoded = jwt.verify(accessToken, (publicKey || rsaPublicKey), {
            audience: 'https://next-graphql.eu.auth0.com/api/v2/',
            issuer: `https://next-graphql.eu.auth0.com/`,
            algorithms: ['RS256']
        })
        return decoded
    } catch (err) {
        console.error(err)
        return false
    }
}

const resolvers = {
    Query: {
        async user(_, { accessToken, ...args }) {
            const auth = await isAuthenticated(accessToken)
            console.log(auth, "user query resolver");
            return auth ? User.findOne(args) : {}
        },
        allUsers(_, args, ctx) {
            console.log(ctx);
            return User.find();
        },
        job(_, args) {
            return Job.findOne(args);
        },
        jobs(_, args, ctx) {
            return Job.find(args)
        },
        allJobs() {
            return Job.find()
        },
        nearbyJobs(_, { lng, lat, distance, order }, ctx) {
            const aggregate = Location.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        spherical: true,
                        distanceField: "dist.calculated",
                        distanceMultiplier: 0.001,
                        maxDistance: distance * 1000 || 10000,
                    }
                },
                {
                    $match: {
                        category: "job"
                    },
                },
                {
                    $group: { _id: "$job", distance: { $first: "$dist.calculated" } }
                },
                {
                    $sort: {
                        "distance": (order && (order === 1 || order === -1) && order) || 1
                    }
                },
                {
                    $lookup: {
                        from: "jobs",
                        localField: "_id",
                        foreignField: "_id",
                        as: "job"
                    }
                }
            ])
            const getResult = async () => {
                const result = await aggregate.exec()
                const jobArray = result.map(job => ({
                    distance: job.distance,
                    job: job.job[0]
                }))
                // console.log(result)
                return jobArray
            }
            return getResult()
        }, nearbyUsers(_, { lng, lat, distance, order }, ctx) {
            const aggregate = Location.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        spherical: true,
                        distanceField: "dist.calculated",
                        distanceMultiplier: 0.001,
                        maxDistance: distance * 1000 || 10000,
                    }
                },
                {
                    $match: {
                        category: "user"
                    },
                },
                {
                    $group: { _id: "$user", distance: { $first: "$dist.calculated" } }
                },
                {
                    $sort: {
                        "distance": (order && (order === 1 || order === -1) && order) || 1
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "user"
                    }
                }
            ])
            const getResult = async () => {
                const result = await aggregate.exec()
                const userArray = result.map(user => ({
                    distance: user.distance,
                    user: user.user[0]
                }))
                // console.log(result)
                return userArray
            }
            return getResult()
        }
    },
    User: {
        id(user) {
            return user._id
        }
    },
    Job: {
        id(job) {
            return job._id
        }
    },
    Location: {
        id(location) {
            return location._id
        }
    },
    LocationRef: {
        async data(loc) {
            const result = await Location.findOne({ _id: loc.data })
            return result
        }
    },
    Mutation: {
        async createUser(_, { input, location }, ctx) {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                ...input
            })
            const userLocation = await new Location({
                category: "user",
                user: user._id,
                loc: location
            }).save()
            user.location = {
                address: userLocation.loc.address,
                data: userLocation._id
            }
            return await user.save()
        },
        async createJob(_, { input, locations }, ctx) {
            const job = new Job({
                _id: new mongoose.Types.ObjectId(),
                ...input,
                locations: []
            })
            for (const loc of locations) {
                const location = await new Location({
                    category: "job",
                    job: job._id,
                    loc
                }).save()
                job.locations.push({
                    address: location.loc.address,
                    data: location._id
                })
            }
            return await job.save()
        }
    },
};

module.exports = resolvers;