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
        submitText="Create Futurecast...this will cost one coin!"
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
