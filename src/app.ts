import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError, z } from 'zod'
import { env } from './env.js'
import { checkInRoutes } from './http/controllers/check-ins/routes.js'
import { gymRoutes } from './http/controllers/gyms/routes.js'
import { userRoutes } from './http/controllers/users/routes.js'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(userRoutes)
app.register(gymRoutes)
app.register(checkInRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: z.treeifyError(error),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Log with an external tool, like datadog, sentry, etc...
  }

  return reply.status(500).send({ message: 'Internal Server Error' })
})
