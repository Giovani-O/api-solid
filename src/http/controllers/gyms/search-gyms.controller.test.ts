import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js'

describe('Search gyms (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym Delta',
        description: 'Gym',
        phone: '99999999',
        latitude: -23.5614,
        longitude: -46.6561,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym Lambda',
        description: 'Gym',
        phone: '99999999',
        latitude: -23.5614,
        longitude: -46.6561,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ query: 'Lambda', page: 1 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Gym Lambda',
      }),
    ])
  })
})
