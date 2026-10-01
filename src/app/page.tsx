import { Suspense } from "react"
import { Board } from "./Board"

export default function Home() {
  return (
    <Suspense>
      <Board />
    </Suspense>
  )
}
