import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js'

describe('Profile (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toBe(200)
    expect(profileResponse.body).toEqual(
      expect.objectContaining({
        user: {
          id: expect.any(String),
          name: 'John Doe',
          email: 'johndoe@mail.com',
          role: 'MEMBER',
          created_at: expect.any(String),
        },
      }),
    )
  })
})
