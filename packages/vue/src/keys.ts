import type { InjectionKey } from "vue"
import type { StellarRuntime } from "@use-stellar/core"

export const stellarRuntimeKey: InjectionKey<StellarRuntime> = Symbol("use-stellar:runtime")
