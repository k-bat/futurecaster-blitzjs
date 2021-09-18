import { Link, Routes } from "blitz"

export const ReturnHomeButton = () => (
  <p style={{ marginTop: "1rem" }}>
    <Link href={Routes.Home()}>Return to Home Page</Link>
  </p>
)
