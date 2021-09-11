import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createFuturecast from "app/futurecasts/mutations/createFuturecast"
import { FuturecastForm, FORM_ERROR } from "app/futurecasts/components/FuturecastForm"

const NewFuturecastPage: BlitzPage = () => {
  const router = useRouter()
  const [createFuturecastMutation] = useMutation(createFuturecast)

  return (
    <div>
      <h1>Create New Futurecast</h1>

      <FuturecastForm
        submitText="Create Futurecast"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateFuturecast}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const futurecast = await createFuturecastMutation(values)
            router.push(Routes.ShowFuturecastPage({ futurecastId: futurecast.id }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.FuturecastsPage()}>
          <a>Futurecasts</a>
        </Link>
      </p>
    </div>
  )
}

NewFuturecastPage.authenticate = true
NewFuturecastPage.getLayout = (page) => <Layout title={"Create New Futurecast"}>{page}</Layout>

export default NewFuturecastPage
