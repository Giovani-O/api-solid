import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './errors/user-already-exists.error.js'
import { RegisterService } from './register.js'
import 'node:crypto'
import { randomUUID } from 'node:crypto'

describe('Register service tests', () => {
  it('should be able to register', async () => {
    const inMemoryRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryRepository)

    const email = `${randomUUID()}@${randomUUID()}.com`

    const { user } = await registerService.execute({
      name: 'Dana Zane',
      email,
      password: 'r3dc@met',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.email).toBe(email)
  })

  it('should encrypt user password on registration', async () => {
    const inMemoryRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryRepository)

    const { user } = await registerService.execute({
      name: 'Dana Zane',
      email: `${randomUUID()}@${randomUUID()}.com`,
      password: 'r3dc@met',
    })

    const isPasswordHashed = await compare('r3dc@met', user.password_hash)
    expect(isPasswordHashed).toBe(true)
  })

  it('should should not register if email is already in use', async () => {
    const inMemoryRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryRepository)

    const email = `${randomUUID()}@${randomUUID()}.com`

    await registerService.execute({
      name: 'Dana Zane',
      email,
      password: '123456',
    })

    await expect(
      registerService.execute({
        name: 'Dana Zane',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
