import root from './root'
import example from './example/index'
import users from './users/index';

import type { FastifyPluginAsync } from 'fastify';

const apiRoutes: FastifyPluginAsync = async (fastify, _options) => {
  // Grouping routes with prefixes
  await fastify.register(root );
  await fastify.register(example);
  await fastify.register(users);
};

export { apiRoutes }

