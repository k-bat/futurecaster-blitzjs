import { ReturnHomeButton } from "app/core/components/ReturnHomeButton"
import Layout from "app/core/layouts/Layout"
import getFuturecasts from "app/futurecasts/queries/getFuturecasts"
import { BlitzPage, Head, Link, Routes, usePaginatedQuery, useRouter } from "blitz"
import { Suspense } from "react"

const ITEMS_PER_PAGE = 100

export const FuturecastsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ futurecasts, hasMore }] = usePaginatedQuery(getFuturecasts, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {futurecasts.map((futurecast) => (
          <li key={futurecast.id}>
            <Link href={Routes.ShowFuturecastPage({ futurecastId: futurecast.id })}>
              <a>{futurecast.mainText}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const FuturecastsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Futurecasts</title>
      </Head>

      <div>
        <ReturnHomeButton />
        <p>
          <Link href={Routes.NewFuturecastPage()}>
            <a>Create Futurecast</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <FuturecastsList />
        </Suspense>
      </div>
    </>
  )
}

FuturecastsPage.authenticate = true
FuturecastsPage.getLayout = (page) => <Layout>{page}</Layout>

export default FuturecastsPage
