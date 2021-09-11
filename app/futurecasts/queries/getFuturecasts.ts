import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetFuturecastsInput
  extends Pick<Prisma.FuturecastFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetFuturecastsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: futurecasts,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.futurecast.count({ where }),
      query: (paginateArgs) => db.futurecast.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      futurecasts,
      nextPage,
      hasMore,
      count,
    }
  }
)
