import { Suspense } from "react"
import { BoardPage } from "./BoardPage"

export default function Home() {
  return (
    <Suspense>
      <BoardPage />
    </Suspense>
  )
}
