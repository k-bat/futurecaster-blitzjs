import { Link, Routes } from "blitz"

export const ReturnHomeButton = () => (
  <div style={{ marginTop: "1rem" }}>
    <Link href={Routes.Home()}>Return to Home Page</Link>
  </div>
)
