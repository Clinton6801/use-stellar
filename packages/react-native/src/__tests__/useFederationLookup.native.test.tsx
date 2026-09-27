import { useFederationLookup } from "../index"
import { mockFederationResolve } from "../__mocks__/@stellar/stellar-sdk"
import { renderHookWithStellar, waitFor } from "../test-utils"
import { assertNoDomGlobals } from "../test-utils/platform"
import { TEST_ADDRESS } from "./fixtures"

describe("useFederationLookup on React Native", () => {
  it("resolves a federated address from the mocked federation server", async () => {
    assertNoDomGlobals()
    mockFederationResolve.mockResolvedValue({
      account_id: TEST_ADDRESS,
      stellar_address: "alice*example.com",
      memo_type: "text",
      memo: "hello",
    })

    const { result } = renderHookWithStellar(() =>
      useFederationLookup({ address: "alice*example.com" })
    )

    await waitFor(() => {
      expect(result.current.record).not.toBeNull()
    })

    expect(result.current.record).toEqual({
      stellarAddress: "alice*example.com",
      accountId: TEST_ADDRESS,
      memoType: "text",
      memo: "hello",
    })
    expect(result.current).toEqual(
      expect.objectContaining({
        loading: false,
        error: null,
        refetch: expect.any(Function),
      })
    )
  })
})
