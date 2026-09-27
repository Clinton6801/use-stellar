import React, { type ReactElement, type ReactNode } from "react"
import { act, create, type ReactTestRenderer } from "react-test-renderer"
import { StellarProvider } from "use-stellar"
import type { CustomNetworkConfig, StellarNetwork } from "use-stellar"

export interface RenderWithStellarOptions {
  network?: StellarNetwork
  networkConfig?: CustomNetworkConfig
}

function Provider({
  children,
  network = "testnet",
  networkConfig,
}: {
  children: ReactNode
  network?: StellarNetwork
  networkConfig?: CustomNetworkConfig
}) {
  return (
    <StellarProvider network={network} networkConfig={networkConfig}>
      {children}
    </StellarProvider>
  )
}

/**
 * Renders a tree inside the RN `StellarProvider` (testnet by default).
 */
export function renderWithStellar(ui: ReactElement, options: RenderWithStellarOptions = {}) {
  let root: ReactTestRenderer
  act(() => {
    root = create(
      <Provider network={options.network} networkConfig={options.networkConfig}>
        {ui}
      </Provider>
    )
  })
  return {
    root: root!,
    unmount: () => {
      act(() => {
        root.unmount()
      })
    },
  }
}

/**
 * Renders a hook inside the RN `StellarProvider` with the rn-14 harness.
 */
export function renderHookWithStellar<T>(
  callback: () => T,
  options: RenderWithStellarOptions = {}
) {
  const result = { current: undefined as T }
  let root: ReactTestRenderer

  function Probe() {
    result.current = callback()
    return null
  }

  act(() => {
    root = create(
      <Provider network={options.network} networkConfig={options.networkConfig}>
        <Probe />
      </Provider>
    )
  })

  return {
    result,
    rerender: (next: () => T) => {
      function NextProbe() {
        result.current = next()
        return null
      }
      act(() => {
        root.update(
          <Provider network={options.network} networkConfig={options.networkConfig}>
            <NextProbe />
          </Provider>
        )
      })
    },
    unmount: () => {
      act(() => {
        root.unmount()
      })
    },
  }
}

export async function waitFor(
  assertion: () => void,
  { timeout = 2000, interval = 20 }: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const start = Date.now()
  let lastError: unknown
  while (Date.now() - start < timeout) {
    try {
      assertion()
      return
    } catch (error) {
      lastError = error
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, interval))
      })
    }
  }
  throw lastError
}

export { act }
