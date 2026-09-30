"use client"

import { SHARP_NOTE_NAMES, type NoteName } from "@/music/notes"
import {
  DEFAULT_SCALE_TYPE_ID,
  SCALE_TYPES,
  type ScaleTypeId,
} from "@/music/scales"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

const DEFAULT_SCALE_ROOT: NoteName = "C"

const NOTE_NAME_VALUES = Object.fromEntries(
  SHARP_NOTE_NAMES.map((noteName) => [noteName, true]),
) as Record<string, true>
const SCALE_TYPE_ID_VALUES = Object.fromEntries(
  SCALE_TYPES.map((scaleType) => [scaleType.id, true]),
) as Record<string, true>

type SearchParamReader = Pick<URLSearchParams, "get">

export type BoardView = {
  showNoteLabels: boolean
  showScale: boolean
  scaleRoot: NoteName
  scaleTypeId: ScaleTypeId
}

export type BoardViewPatch = Partial<BoardView>

type BoardViewSearchParams = {
  boardView: BoardView
  replaceBoardView: (patch: BoardViewPatch) => void
}

const booleanParam = (
  searchParams: SearchParamReader,
  key: string,
  defaultValue: boolean,
): boolean => {
  const value = searchParams.get(key)

  if (value === "1") return true
  if (value === "0") return false
  return defaultValue
}

const noteNameParam = (searchParams: SearchParamReader): NoteName => {
  const value = searchParams.get("root")

  if (value !== null && NOTE_NAME_VALUES[value] === true)
    return value as NoteName
  return DEFAULT_SCALE_ROOT
}

const scaleTypeIdParam = (searchParams: SearchParamReader): ScaleTypeId => {
  const value = searchParams.get("type")

  if (value !== null && SCALE_TYPE_ID_VALUES[value] === true) {
    return value as ScaleTypeId
  }

  return DEFAULT_SCALE_TYPE_ID
}

export const useBoardViewSearchParams = (): BoardViewSearchParams => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const replaceBoardView = useCallback(
    (patch: BoardViewPatch) => {
      const nextParams = new URLSearchParams(searchParams)

      if (patch.showNoteLabels !== undefined) {
        nextParams.set("labels", patch.showNoteLabels ? "1" : "0")
      }

      if (patch.showScale !== undefined) {
        nextParams.set("scale", patch.showScale ? "1" : "0")
      }

      if (patch.scaleRoot !== undefined) {
        nextParams.set("root", patch.scaleRoot)
      }

      if (patch.scaleTypeId !== undefined) {
        nextParams.set("type", patch.scaleTypeId)
      }

      router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  return {
    boardView: {
      showNoteLabels: booleanParam(searchParams, "labels", true),
      showScale: booleanParam(searchParams, "scale", false),
      scaleRoot: noteNameParam(searchParams),
      scaleTypeId: scaleTypeIdParam(searchParams),
    },
    replaceBoardView,
  }
}
