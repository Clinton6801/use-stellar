import type { App, Plugin } from "vue"
import { createStellarRuntime } from "@use-stellar/core"
import type { StellarRuntime, StellarRuntimeOptions } from "@use-stellar/core"
import { stellarRuntimeKey } from "./keys"

export function createStellarPlugin(
  options: StellarRuntimeOptions | StellarRuntime
): Plugin {
  const runtime = "queryStore" in options && "networkConfig" in options
    ? options
    : createStellarRuntime(options)

  return {
    install(app: App) {
      app.provide(stellarRuntimeKey, runtime)
    },
  }
}
