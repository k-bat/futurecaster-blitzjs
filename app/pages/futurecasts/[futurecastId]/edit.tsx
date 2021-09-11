import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getFuturecast from "app/futurecasts/queries/getFuturecast"
import updateFuturecast from "app/futurecasts/mutations/updateFuturecast"
import { FuturecastForm, FORM_ERROR } from "app/futurecasts/components/FuturecastForm"

export const EditFuturecast = () => {
  const router = useRouter()
  const futurecastId = useParam("futurecastId", "number")
  const [futurecast, { setQueryData }] = useQuery(
    getFuturecast,
    { id: futurecastId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateFuturecastMutation] = useMutation(updateFuturecast)

  return (
    <>
      <Head>
        <title>Edit Futurecast {futurecast.id}</title>
      </Head>

      <div>
        <h1>Edit Futurecast {futurecast.id}</h1>
        <pre>{JSON.stringify(futurecast, null, 2)}</pre>

        <FuturecastForm
          submitText="Update Futurecast"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateFuturecast}
          initialValues={futurecast}
          onSubmit={async (values) => {
            try {
              const updated = await updateFuturecastMutation({
                id: futurecast.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowFuturecastPage({ futurecastId: updated.id }))
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditFuturecastPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditFuturecast />
      </Suspense>

      <p>
        <Link href={Routes.FuturecastsPage()}>
          <a>Futurecasts</a>
        </Link>
      </p>
    </div>
  )
}

EditFuturecastPage.authenticate = true
EditFuturecastPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditFuturecastPage
