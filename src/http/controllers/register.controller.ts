import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists.error.js'
import { makeRegisterService } from '@/services/factories/make-register-service.js'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  })

  const body = registerBodySchema.parse(request.body)

  try {
    // Factory
    const registerService = makeRegisterService()

    await registerService.execute(body)
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      reply.status(409).send({
        message: '[409] Conflict',
      })
    }

    throw err
  }

  return reply.status(201).send()
}
