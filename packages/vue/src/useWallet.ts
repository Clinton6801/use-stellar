import { computed, onScopeDispose, ref } from "vue"
import type { ComputedRef, WritableComputedRef } from "vue"
import { getWalletAdapter, toStellarError } from "@use-stellar/core"
import type { StellarError, WalletState, WalletType } from "@use-stellar/core"
import { useStellarRuntime } from "./useStellarRuntime"

const emptyWallet = (): WalletState => ({
  connected: false, connecting: false, address: null, network: null,
  wallet: null, walletName: null, error: null, walletNetwork: null,
  walletNetworkPassphrase: null,
})

export interface UseWalletReturn {
  connected: ComputedRef<boolean>
  connecting: WritableComputedRef<boolean>
  address: WritableComputedRef<string | null>
  wallet: WritableComputedRef<WalletType | null>
  error: WritableComputedRef<StellarError | null>
  state: ComputedRef<WalletState>
  connect: (wallet?: WalletType) => Promise<void>
  disconnect: () => void
  isAvailable: (wallet?: WalletType) => Promise<boolean>
}

/** Vue wallet API backed by the shared adapter registry and network runtime. */
export function useWallet(): UseWalletReturn {
  const runtime = useStellarRuntime()
  const stateRef = ref<WalletState>(emptyWallet())
  const state = computed(() => stateRef.value)
  const connected = computed(() => stateRef.value.connected)
  let operation = 0

  const isAvailable = async (walletType: WalletType = "freighter") => {
    try { return await getWalletAdapter(walletType).isAvailable() }
    catch { return false }
  }

  const connect = async (walletType: WalletType = "freighter") => {
    const currentOperation = ++operation
    stateRef.value = { ...stateRef.value, connecting: true, error: null }
    try {
      const adapter = getWalletAdapter(walletType)
      const connection = await adapter.connect(runtime.network)
      const networkDetails = await adapter.getNetworkDetails(runtime.network)
      if (currentOperation !== operation) return
      stateRef.value = {
        connected: true, connecting: false, address: connection.address,
        network: runtime.network, wallet: connection.wallet,
        walletName: adapter.metadata.name, error: null,
        walletNetwork: networkDetails.network,
        walletNetworkPassphrase: networkDetails.networkPassphrase,
      }
    } catch (cause) {
      if (currentOperation === operation) {
        stateRef.value = { ...stateRef.value, connecting: false, error: toStellarError(cause) }
      }
    }
  }

  const disconnect = () => {
    ++operation
    if (stateRef.value.wallet) {
      try { void getWalletAdapter(stateRef.value.wallet).disconnect?.() } catch { /* state still clears */ }
    }
    stateRef.value = emptyWallet()
  }

  onScopeDispose(() => { ++operation })
  return {
    connected, connecting: computed({ get: () => stateRef.value.connecting, set: value => { stateRef.value.connecting = value } }),
    address: computed({ get: () => stateRef.value.address, set: value => { stateRef.value.address = value } }),
    wallet: computed({ get: () => stateRef.value.wallet, set: value => { stateRef.value.wallet = value } }),
    error: computed({ get: () => stateRef.value.error, set: value => { stateRef.value.error = value } }),
    state, connect, disconnect, isAvailable,
  }
}
