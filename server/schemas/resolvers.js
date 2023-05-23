// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        getSingleUser: async (_, { id, username }, { user }) => {
            try {
                let foundUser;

                if(user) {
                    foundUser = await User.findById(user._id);
                } else if(id) {
                    foundUser = await User.findById(id);
                } else if (username) {
                    foundUser = await User.findOne({ username });
                } else {
                    throw new Error('Invalid. Please provide user id or username')
                }

            if(!foundUser) {
                throw new Error('Cannot find user with id or username!')
            }

            return foundUser;
            } catch (error) {
                throw new Error('Server error')
            }
        }
    }
}