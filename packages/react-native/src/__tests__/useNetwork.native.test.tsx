import { useNetwork } from "../index"
import { renderHookWithStellar } from "../test-utils"
import { assertNoDomGlobals } from "../test-utils/platform"

describe("useNetwork on React Native", () => {
  it("returns the testnet provider config", () => {
    assertNoDomGlobals()

    const { result } = renderHookWithStellar(() => useNetwork())

    expect(result.current.network).toBe("testnet")
    expect(result.current.isTestnet).toBe(true)
    expect(result.current.isMainnet).toBe(false)
    expect(result.current.networkConfig.horizonUrl).toBe("https://horizon-testnet.stellar.org")
    expect(result.current).toEqual(
      expect.objectContaining({
        network: "testnet",
        networkConfig: expect.any(Object),
        isTestnet: true,
        isMainnet: false,
      })
    )
  })
})
