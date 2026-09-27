import { useSorobanContract } from "../index"
import { mockSimulateTransaction, xdr } from "../__mocks__/@stellar/stellar-sdk"
import { act, renderHookWithStellar, waitFor } from "../test-utils"
import { assertNoDomGlobals } from "../test-utils/platform"
import { CONTRACT_ID } from "./fixtures"

const i128 = 250n
const u128 = 99n

describe("useSorobanContract on React Native", () => {
  it("decodes i128 and u128 results to BigInt", async () => {
    assertNoDomGlobals()
    mockSimulateTransaction.mockResolvedValue({
      result: { retval: xdr.ScVal.scvI128(i128) },
    })

    const { result } = renderHookWithStellar(() =>
      useSorobanContract<bigint>({
        contractId: CONTRACT_ID,
        method: "balance",
        args: [xdr.ScVal.scvAddress("GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5")],
      })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(i128)
    expect(typeof result.current.data).toBe("bigint")
    expect(result.current).toEqual(
      expect.objectContaining({
        loading: false,
        error: null,
        refetch: expect.any(Function),
      })
    )

    mockSimulateTransaction.mockResolvedValue({
      result: { retval: xdr.ScVal.scvU128(u128) },
    })
    act(() => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.data).toBe(u128)
    })
    expect(typeof result.current.data).toBe("bigint")
  })

  it("serializes BigInt arguments to a stable cache key", async () => {
    mockSimulateTransaction.mockResolvedValue({
      result: { retval: xdr.ScVal.scvI128(i128) },
    })

    const { result } = renderHookWithStellar(() => ({
      first: useSorobanContract<bigint>({
        contractId: CONTRACT_ID,
        method: "balance",
        args: [i128],
      }),
      second: useSorobanContract<bigint>({
        contractId: CONTRACT_ID,
        method: "balance",
        args: [i128],
      }),
    }))

    await waitFor(() => {
      expect(result.current.first.loading).toBe(false)
      expect(result.current.second.loading).toBe(false)
    })

    expect(result.current.first.error?.message).toContain("bigint")
    expect(result.current.second.error?.message).toBe(result.current.first.error?.message)
    expect(mockSimulateTransaction).not.toHaveBeenCalled()
  })
})
