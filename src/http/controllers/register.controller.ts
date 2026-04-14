import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { registerService } from '@/services/register.js'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  })

  const body = registerBodySchema.parse(request.body)

  try {
    await registerService(body)
  } catch {
    reply.status(409).send({
      message: '[409] Conflict',
    })
  }

  return reply.status(201).send()
}
