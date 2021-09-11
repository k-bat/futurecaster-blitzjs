import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getFuturecast from "app/futurecasts/queries/getFuturecast"
import deleteFuturecast from "app/futurecasts/mutations/deleteFuturecast"

export const Futurecast = () => {
  const router = useRouter()
  const futurecastId = useParam("futurecastId", "number")
  const [deleteFuturecastMutation] = useMutation(deleteFuturecast)
  const [futurecast] = useQuery(getFuturecast, { id: futurecastId })

  return (
    <>
      <Head>
        <title>Futurecast {futurecast.id}</title>
      </Head>

      <div>
        <h1>Futurecast {futurecast.id}</h1>
        <pre>{JSON.stringify(futurecast, null, 2)}</pre>

        <Link href={Routes.EditFuturecastPage({ futurecastId: futurecast.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteFuturecastMutation({ id: futurecast.id })
              router.push(Routes.FuturecastsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowFuturecastPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.FuturecastsPage()}>
          <a>Futurecasts</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Futurecast />
      </Suspense>
    </div>
  )
}

ShowFuturecastPage.authenticate = true
ShowFuturecastPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowFuturecastPage
