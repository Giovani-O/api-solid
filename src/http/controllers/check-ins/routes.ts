import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt.js'
import { createCheckIn } from './create-check-in.controller.js'
import { history } from './history.controller.js'
import { metrics } from './metrics.controller.js'
import { validateCheckIn } from './validate-check-in.controller.js'

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms/:gymId/check-ins', createCheckIn)
  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)
  app.patch('/check-ins/:checkInId/validate', validateCheckIn)
}
