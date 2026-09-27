import "@testing-library/react-native"
import { useAccount, useBalance } from "../index"
import { mockLoadAccount } from "../__mocks__/@stellar/stellar-sdk"
import { renderHookWithStellar, waitFor } from "../test-utils"
import { assertNoDomGlobals } from "../test-utils/platform"
import { mockAccountData, TEST_ADDRESS } from "./fixtures"

describe("useBalance on React Native", () => {
  it("returns the mocked XLM balance and shares the account cache", async () => {
    assertNoDomGlobals()
    mockLoadAccount.mockResolvedValue(mockAccountData)

    const { result } = renderHookWithStellar(() => ({
      balance: useBalance({ address: TEST_ADDRESS, asset: "XLM" }),
      account: useAccount({ address: TEST_ADDRESS }),
    }))

    await waitFor(() => {
      expect(result.current.balance.loading).toBe(false)
      expect(result.current.account.loading).toBe(false)
    })

    expect(result.current.balance.balance).toBe("100.0000000")
    expect(result.current.account.account?.address).toBe(TEST_ADDRESS)
    expect(mockLoadAccount).toHaveBeenCalledTimes(1)
    expect(result.current.balance).toEqual(
      expect.objectContaining({
        balance: expect.any(String),
        balances: expect.any(Array),
        loading: false,
        error: null,
        refetch: expect.any(Function),
      })
    )
  })
})
