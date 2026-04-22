import { prisma } from '@/lib/prisma.js'
import { boundedBoxToHaversineSphere } from '@/utils/convert-bounded-box-to-sphere.js'
import type { GymCreateInput } from '../../../generated/prisma/models.js'
import type {
  FindManyNearbyParams,
  GymsRepository,
} from '../gyms-repository.js'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    // A query proposta não estava funcionando corretamente com o teste e2e
    // Após horas testando e debugando com a ajuda de IA, eu cheguei a esse pattern
    // Foi necessário substituir a query por sintaxe nativa do prisma
    // Primeiro, foi necessário obter uma bounding box, o quadrado de 20x20km em volta da coordenada.
    // Depois, foi necessário converter esse quadrado em uma esfera para obter o raio ao redor da coordenada.
    // No fim, o que é feito é um approach de Pre-Filter + Precise-Filter, ou Two-Pass filter
    // Primeiro é feito um filtro mais geral (bounding box)
    // Depois é feito um filtro preciso (esfera)

    // Pre-filter
    const latDelta = 10 / 111
    const lngDelta = 10 / (111 * Math.cos((latitude * Math.PI) / 180))
    const gyms = await prisma.gym.findMany({
      where: {
        latitude: { gte: latitude - latDelta, lte: latitude + latDelta },
        longitude: { gte: longitude - lngDelta, lte: longitude + lngDelta },
      },
    })

    // Precise-filter
    return gyms.filter((gym) => {
      const dist = boundedBoxToHaversineSphere(
        latitude,
        longitude,
        Number(gym.latitude),
        Number(gym.longitude),
      )
      return dist <= 10
    })
  }
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }
  async create(data: GymCreateInput) {
    const gym = await prisma.gym.create({ data })

    return gym
  }
}
