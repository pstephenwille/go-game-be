import { type FastifyPluginAsync, type FastifyServerOptions } from 'fastify'
import supportPlugin, { type SupportPluginOptions } from '@/plugins/support'
import sensiblePlugin from '@/plugins/sensible'
// import {root, example } from '@/routes'
import { apiRoutes } from '@/routes'

// 1. AppOptions should extend FastifyServerOptions directly now.
// No more Partial<AutoloadPluginOptions> needed.
interface AppOptions extends FastifyServerOptions {
  // Add any custom global application configuration properties here if needed
}



// Pass --options via CLI arguments in command to enable these options;;
const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  _opts
): Promise<void> => {
  // 2. Manually register your plugins sequentially
  const pluginOptions: SupportPluginOptions = {}

  // Registers your custom plugin and passes down local options
  fastify.register(supportPlugin, pluginOptions)

  // Registers your wrapped sensible plugin
  fastify.register(sensiblePlugin)

  // Registers your root endpoints;
  fastify.register(apiRoutes)

  // Place here your custom code!
}

export default app
export { app, options }
