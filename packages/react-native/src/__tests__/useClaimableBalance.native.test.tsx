import { useClaimableBalance } from "../index"
import { mockClaimableCall } from "../__mocks__/@stellar/stellar-sdk"
import { renderHookWithStellar, waitFor } from "../test-utils"
import { assertNoDomGlobals } from "../test-utils/platform"
import { TEST_ADDRESS } from "./fixtures"

describe("useClaimableBalance on React Native", () => {
  it("returns mocked claimable balances", async () => {
    assertNoDomGlobals()
    mockClaimableCall.mockResolvedValue({
      records: [
        {
          id: "claimable-1",
          asset: "native",
          amount: "10.0000000",
          claimants: [{ destination: TEST_ADDRESS, predicate: { unconditional: true } }],
          sponsor: undefined,
        },
      ],
    })

    const { result } = renderHookWithStellar(() => useClaimableBalance({ address: TEST_ADDRESS }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.balances).toHaveLength(1)
    expect(result.current.balances[0]).toEqual(
      expect.objectContaining({
        id: "claimable-1",
        asset: "native",
        amount: "10.0000000",
      })
    )
    expect(result.current).toEqual(
      expect.objectContaining({
        loading: false,
        error: null,
        isStale: false,
        refetch: expect.any(Function),
      })
    )
  })
})
