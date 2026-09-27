import { useAsset } from "../index"
import { mockAssetsCall } from "../__mocks__/@stellar/stellar-sdk"
import { renderHookWithStellar, waitFor } from "../test-utils"
import { assertNoDomGlobals } from "../test-utils/platform"
import { USDC_ISSUER } from "./fixtures"

describe("useAsset on React Native", () => {
  it("returns mocked asset metadata", async () => {
    assertNoDomGlobals()
    mockAssetsCall.mockResolvedValue({
      records: [
        {
          asset_code: "USDC",
          asset_issuer: USDC_ISSUER,
          amount: "1000000.0000000",
          num_accounts: 100,
          flags: { auth_required: false, auth_revocable: false, auth_immutable: true },
        },
      ],
    })

    const { result } = renderHookWithStellar(() => useAsset({ code: "USDC", issuer: USDC_ISSUER }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.asset).toEqual(
      expect.objectContaining({
        code: "USDC",
        issuer: USDC_ISSUER,
        supply: "1000000.0000000",
        numAccounts: 100,
      })
    )
    expect(result.current).toEqual(
      expect.objectContaining({
        loading: false,
        error: null,
        refetch: expect.any(Function),
      })
    )
  })
})
