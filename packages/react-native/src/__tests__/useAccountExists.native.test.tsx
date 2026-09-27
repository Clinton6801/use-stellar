import { useAccountExists } from "../index"
import { mockLoadAccount } from "../__mocks__/@stellar/stellar-sdk"
import { renderHookWithStellar, waitFor } from "../test-utils"
import { assertNoDomGlobals } from "../test-utils/platform"
import { mockAccountData, TEST_ADDRESS } from "./fixtures"

describe("useAccountExists on React Native", () => {
  it("returns exists for a mocked Horizon account", async () => {
    assertNoDomGlobals()
    mockLoadAccount.mockResolvedValue(mockAccountData)

    const { result } = renderHookWithStellar(() => useAccountExists({ address: TEST_ADDRESS }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.exists).toBe(true)
    expect(result.current.reason).toBe("exists")
    expect(result.current).toEqual(
      expect.objectContaining({
        exists: true,
        reason: "exists",
        loading: false,
        error: null,
        refetch: expect.any(Function),
      })
    )
  })
})
