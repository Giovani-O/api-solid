import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { InvalidCredentialError } from '@/services/errors/invalid-credentials.error.js'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service.js'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodyScheme = z.object({
    email: z.email(),
    password: z.string().min(6),
  })

  const body = authenticateBodyScheme.parse(request.body)

  try {
    // Factory
    const authenticateService = makeAuthenticateService()

    const { user } = await authenticateService.execute(body)
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return reply.status(200).send({
      token,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      reply.status(400).send({
        message: `[400] Bad Request: ${err.message}`,
      })
    }

    throw err
  }
}
