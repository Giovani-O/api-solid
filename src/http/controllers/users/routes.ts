import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt.js'
import { authenticate } from './authenticate.controller.js'
import { profile } from './profile.controller.js'
import { register } from './register.controller.js'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  /** Authenticated  */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
