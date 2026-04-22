import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { GetUserProfileService } from '../get-user-profile.js'

export function makeGetUserProfileService() {
  const usersRepository = new PrismaUsersRepository()
  const service = new GetUserProfileService(usersRepository)

  return service
}
