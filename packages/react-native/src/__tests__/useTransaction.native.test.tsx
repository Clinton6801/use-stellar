import { useTransaction } from "../index"
import { mockTransactionCall } from "../__mocks__/@stellar/stellar-sdk"
import {
  act,
  getAppState,
  setAppState,
  setOnline,
  renderHookWithStellar,
  waitFor,
} from "../test-utils"
import { assertNoDomGlobals } from "../test-utils/platform"
import { TEST_HASH } from "./fixtures"

const successRecord = {
  hash: TEST_HASH,
  successful: true,
  ledger: 12345,
  created_at: "2024-01-01T00:00:00Z",
  fee_charged: "100",
  envelope_xdr: "AAAA",
}

describe("useTransaction on React Native", () => {
  it("returns the web hook shape and stops at a final status", async () => {
    assertNoDomGlobals()
    mockTransactionCall.mockResolvedValue(successRecord)

    const { result, unmount } = renderHookWithStellar(() =>
      useTransaction({ hash: TEST_HASH, watch: true })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.transaction?.status).toBe("success")
    })

    expect(result.current).toEqual(
      expect.objectContaining({
        transaction: expect.objectContaining({ hash: TEST_HASH, status: "success" }),
        loading: false,
        error: null,
        refetch: expect.any(Function),
      })
    )
    unmount()
  })

  it("keeps the last status across AppState background and NetInfo offline", async () => {
    mockTransactionCall.mockResolvedValue(successRecord)

    const { result, unmount } = renderHookWithStellar(() =>
      useTransaction({ hash: TEST_HASH, watch: true })
    )

    await waitFor(() => {
      expect(result.current.transaction?.status).toBe("success")
    })

    const fetchesBeforeBackground = mockTransactionCall.mock.calls.length
    setAppState("background")
    expect(getAppState()).toBe("background")
    expect(result.current.transaction?.status).toBe("success")
    expect(mockTransactionCall).toHaveBeenCalledTimes(fetchesBeforeBackground)

    setAppState("active")
    setOnline(false)
    mockTransactionCall.mockRejectedValue(new Error("Network Error"))

    act(() => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })

    expect(result.current.transaction?.status).toBe("success")
    expect(result.current.error?.code).toBe("NETWORK_ERROR")
    assertNoDomGlobals()
    unmount()
  })
})
