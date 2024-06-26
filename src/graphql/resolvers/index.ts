import { mergeResolvers } from '@graphql-tools/merge';
// import userResolvers from './userResolvers';
import authResolver from './authResolver';
const resolvers = mergeResolvers([authResolver]);

export default resolvers;
