import { compare } from 'bcryptjs'
import type { UsersRepository } from '@/repositories/users-repository.js'
import type { User } from '../../generated/prisma/client.js'
import { InvalidCredentialError } from './errors/invalid-credentials.error.js'

interface AuthenticateServiceRequest {
  email: string
  password: string
}

interface AuthenticateServiceResponse {
  user: User
}

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialError()
    }

    const doesPasswordsMatch = await compare(password, user.password_hash)

    if (!doesPasswordsMatch) {
      throw new InvalidCredentialError()
    }

    return {
      user,
    }
  }
}
