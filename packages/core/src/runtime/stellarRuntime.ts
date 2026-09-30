import { QueryStore } from "../cache"
import type { QueryConfig } from "../cache"
import type { CustomNetworkConfig, NetworkConfig, StellarNetwork } from "../types"
import { resolveNetworkConfig } from "./network"

export interface StellarRuntime {
  network: StellarNetwork
  networkConfig: NetworkConfig
  queryStore: QueryStore
}

export interface StellarRuntimeOptions {
  network?: StellarNetwork
  networkConfig?: CustomNetworkConfig
  queryConfig?: QueryConfig
}

/** Create the framework-neutral application runtime used by Vue integrations. */
export function createStellarRuntime(options: StellarRuntimeOptions = {}): StellarRuntime {
  const network = options.network ?? "testnet"
  return {
    network,
    networkConfig: resolveNetworkConfig(network, options.networkConfig),
    queryStore: new QueryStore(options.queryConfig),
  }
}
