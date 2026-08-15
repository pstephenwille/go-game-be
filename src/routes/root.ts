import { type FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', async function (_request, _reply) {
    const message = fastify.someSupport();

    return { message }
  })
}

export default root
