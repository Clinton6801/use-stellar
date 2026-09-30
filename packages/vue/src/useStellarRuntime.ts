import { inject } from "vue"
import { stellarRuntimeKey } from "./keys"
import type { StellarRuntime } from "@use-stellar/core"

export function useStellarRuntime(): StellarRuntime {
  const runtime = inject(stellarRuntimeKey)
  if (!runtime) {
    throw new Error("use-stellar/vue: No Stellar plugin installed. Call app.use(createStellarPlugin(...)) first.")
  }
  return runtime
}
