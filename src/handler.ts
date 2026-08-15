import Fastify from 'fastify'
import awsLambdaFastify from '@fastify/aws-lambda'
import app, { options } from './app'

const server = Fastify({
  logger: true,
  ...options
})

// Register the app factory as the root plugin
server.register(app)

// Export the Lambda handler function
export const handler = awsLambdaFastify(server)
