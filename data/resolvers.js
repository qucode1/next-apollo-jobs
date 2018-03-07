const mongoose = require('mongoose');
const { User, Job, Location } = require('./mongodb');

const resolvers = {
    Query: {
        user(_, args) {
            return User.findOne(args);
        },
        allUsers() {
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