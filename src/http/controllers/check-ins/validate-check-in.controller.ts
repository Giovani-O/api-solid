import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeValidateCheckInService } from '@/services/factories/make-validate-check-in-service.js'

export async function validateCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckInService = makeValidateCheckInService()

  const { checkIn } = await validateCheckInService.execute({
    checkInId,
  })

  return reply.status(204).send({ checkIn })
}
