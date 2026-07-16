import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import eslintConfigPrettier from "eslint-config-prettier/flat"

export default defineConfig([
  ...nextVitals,
  eslintConfigPrettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])
