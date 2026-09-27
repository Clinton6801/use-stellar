import { useAccount } from "../index"
import { lastHorizonCtorArgs, mockLoadAccount } from "../__mocks__/@stellar/stellar-sdk"
import { renderHookWithStellar, waitFor } from "../test-utils"
import { assertNoDomGlobals } from "../test-utils/platform"
import { mockAccountData, TEST_ADDRESS } from "./fixtures"

describe("useAccount on React Native", () => {
  it("returns mocked account data and honours allowHttp on a custom horizon", async () => {
    assertNoDomGlobals()
    mockLoadAccount.mockResolvedValue(mockAccountData)

    const { result } = renderHookWithStellar(() => useAccount({ address: TEST_ADDRESS }), {
      network: "custom",
      networkConfig: {
        horizonUrl: "http://127.0.0.1:8000",
        sorobanUrl: "http://127.0.0.1:8000/soroban/rpc",
        networkPassphrase: "Standalone Network ; February 2017",
      },
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.account?.address).toBe(TEST_ADDRESS)
    expect(result.current.account?.sequence).toBe("1234567890123456")
    expect(lastHorizonCtorArgs.url).toBe("http://127.0.0.1:8000")
    expect(lastHorizonCtorArgs.opts?.allowHttp).toBe(true)
    expect(result.current).toEqual(
      expect.objectContaining({
        account: expect.any(Object),
        loading: false,
        error: null,
        isStale: false,
        refetch: expect.any(Function),
      })
    )
  })
})
