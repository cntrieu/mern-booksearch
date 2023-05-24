// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        // get a single user by either their id or their username
        me: async (parent, args, context) => {
            if(context.user) {
                return User.findOne({ _id: context.user._id})
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },

    Mutation: {
         // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);

            return { token, profile };
        },

         // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        // {body} is destructured req.body

        login: async(parent, {email, password}) => {
            const user = await User.findOne({email})

            if(!user) {
                throw new AuthenticationError("No user with this email found!")
            }

            const correctPw = await user.isCorrectPassword(password)

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
              }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async(parent, {userId, book}, context) => {
            if(context.user) {
                return User.findOneAndUpdate(
                    { _id: userId},
                    {
                        $addToSet: { savedBooks: book}
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                )
            }
               // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError('You need to be logged in!');
        },

       removeBook: async (parent, {book}, context) => {
            if(context.user) {
                return User.findOneAndDelete(
                    {_id: context.user._id},
                    { $pull: {savedBooks: book}},
                    { new: true}
                    );
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
}

module.exports = resolvers;