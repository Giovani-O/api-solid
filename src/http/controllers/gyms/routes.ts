import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt.js'
import { createGym } from './create-gym.controller.js'
import { fetchNearbyGyms } from './fetch-nearby-gyms.controller.js'
import { searchGyms } from './search-gyms.controller.js'

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', createGym)
  app.get('/gyms/nearby', fetchNearbyGyms)
  app.get('/gyms/search', searchGyms)
}
