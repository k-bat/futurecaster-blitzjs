import { Form, FormProps } from "app/core/components/Form"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function FuturecastForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return <Form<S> {...props}></Form>
}
