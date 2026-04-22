import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { MaxDistanceError } from '@/services/errors/max-distance-error.js'
import { ResourceNotFoundError } from '@/services/errors/resource-not-found.error.js'
import { TooManyCheckInsError } from '@/services/errors/too-many-check-ins.error.js'
import { makeCheckInService } from '@/services/factories/make-check-in-service.js'

export async function createCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCheckInParamsSchema = z.object({
    gymId: z.uuid(),
  })

  const createCheckInBodySchema = z.object({
    userLatitude: z.coerce.number(),
    userLongitude: z.coerce.number(),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { userLatitude, userLongitude } = createCheckInBodySchema.parse(
    request.body,
  )

  try {
    const checkInService = makeCheckInService()

    const { checkIn } = await checkInService.execute({
      gymId,
      userId: request.user.sub,
      userLatitude,
      userLongitude,
    })

    return reply.status(201).send({ checkIn })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof MaxDistanceError) {
      return reply.status(400).send({ message: err.message })
    }
    if (err instanceof TooManyCheckInsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
