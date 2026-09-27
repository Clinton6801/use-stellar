/**
 * @use-stellar/vue — Vue 3 composables for Stellar
 *
 * This package provides Vue 3 composables that adapt the framework-neutral
 * Stellar runtime to Vue's reactivity model. It requires the core `use-stellar`
 * package and Vue 3.3+.
 *
 * @example
 * import { createApp } from "vue"
 * import { createStellarPlugin } from "@use-stellar/vue"
 * import App from "./App.vue"
 *
 * const app = createApp(App)
 * app.use(createStellarPlugin({ network: "testnet" }))
 * app.mount("#app")
 */

export { createStellarPlugin } from "./plugin"
export type { CreateStellarPluginOptions } from "./plugin"

export { useStellar } from "./useStellar"
export type { UseStellarReturn } from "./useStellar"

// Re-export core runtime types for convenience
export { createStellarRuntime } from "use-stellar"
export type {
  StellarRuntime,
  StellarRuntimeOptions,
  StellarRuntimeSnapshot,
  StellarRuntimeListener,
} from "use-stellar"
