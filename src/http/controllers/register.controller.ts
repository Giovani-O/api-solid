import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists.error.js'
import { RegisterService } from '@/services/register.js'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  })

  const body = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(usersRepository)

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
