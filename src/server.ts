// src/server.ts
import Fastify from 'fastify'
import app, { options } from './app'

const server = Fastify({
  logger: true,
  ...options
})

async function start() {
  // Register the app factory as the root plugin
  await server.register(app)

  try {
    await server.listen({ port: 3000, host: '0.0.0.0' })

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
