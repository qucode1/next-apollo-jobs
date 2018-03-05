const { User, Job } = require('./mongodb');

const resolvers = {
    Query: {
        user(_, args) {
            return User.findOne(args);
        },
        allUsers() {
            return User.find();
        },
        job(_, args) {
            return Job.find(args);
        },
        jobs(_, args, ctx) {
            return Job.find(args)
        },
        allJobs() {
            return Job.find()
        }
    },
    User: {
        id(user) {
            return user._id
        }
    },
    // Job: {
    //     locations(job) {
    //         return job.locations.map((location) => {
    //             Locations.findById(location.id)
    //         })
    //     },
    // },
    Mutation: {
        async createUser(_, { input }) {
            return await new User({
                ...input,
            }).save()
            // return await user.save()
        },
        async createJob(_, { input, locations }, ctx) {
            console.log(input)
            console.log(locations)
            locations.forEach(location => {
                location.type = "Point"
            })
            const job = new Job({
                ...input,
                locations
            })
            return await job.save()
            // return job
        },
        // async createPost(_, { input }) {
        //     const author = await Author.findOne({ id: input.author });
        //     const count = await Post.count();
        //     const post = new Post({
        //         ...input,
        //         author: author._id,
        //         id: count + 1,
        //     });
        //     await post.save();
        //     return post.toObject();
        // },
    },
};

module.exports = resolvers;