import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateFuturecast = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateFuturecast),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const futurecast = await db.futurecast.create({ data: input })

    return futurecast
  }
)
