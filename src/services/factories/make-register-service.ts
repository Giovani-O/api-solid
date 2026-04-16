import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { RegisterService } from '../register.js'

export function makeRegisterService() {
  const usersRepository = new PrismaUsersRepository()
  const registerService = new RegisterService(usersRepository)

  return registerService
}
