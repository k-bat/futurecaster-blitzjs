import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateFuturecast = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateFuturecast),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const futurecast = await db.futurecast.update({ where: { id }, data })

    return futurecast
  }
)
