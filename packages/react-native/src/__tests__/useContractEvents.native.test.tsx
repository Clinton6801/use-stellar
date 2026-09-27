import { useContractEvents } from "../index"
import { mockGetEvents, mockGetLatestLedger } from "../__mocks__/@stellar/stellar-sdk"
import { getAppState, setAppState, renderHookWithStellar, waitFor } from "../test-utils"
import { assertNoDomGlobals } from "../test-utils/platform"
import { CONTRACT_ID } from "./fixtures"

describe("useContractEvents on React Native", () => {
  it("returns the web hook shape for mocked events", async () => {
    assertNoDomGlobals()
    mockGetLatestLedger.mockResolvedValue({ sequence: 1000 })
    mockGetEvents.mockResolvedValue({
      latestLedger: 1001,
      events: [
        {
          id: "event-1",
          contractId: CONTRACT_ID,
          ledger: 1001,
          ledgerClosedAt: "2026-09-27T00:00:00Z",
          pagingToken: "token-1",
          topic: [{ decoded: "transfer" }],
          value: { decoded: 10n },
        },
      ],
    })

    const { result, unmount } = renderHookWithStellar(() =>
      useContractEvents({ contractIds: [CONTRACT_ID], interval: 60_000 })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.events.length).toBe(1)
    })

    expect(result.current.events[0]).toEqual(
      expect.objectContaining({
        id: "event-1",
        contractId: CONTRACT_ID,
        value: 10n,
      })
    )
    expect(result.current).toEqual(
      expect.objectContaining({
        latestLedger: 1001,
        loading: false,
        error: null,
        clear: expect.any(Function),
      })
    )
    unmount()
  })

  it("keeps the last events when the app is backgrounded", async () => {
    mockGetLatestLedger.mockResolvedValue({ sequence: 1000 })
    mockGetEvents.mockResolvedValue({
      latestLedger: 1001,
      events: [
        {
          id: "event-1",
          contractId: CONTRACT_ID,
          ledger: 1001,
          ledgerClosedAt: "2026-09-27T00:00:00Z",
          pagingToken: "token-1",
          topic: [{ decoded: "transfer" }],
          value: { decoded: 1n },
        },
      ],
    })

    const { result, unmount } = renderHookWithStellar(() =>
      useContractEvents({ contractIds: [CONTRACT_ID], interval: 60_000 })
    )

    await waitFor(() => {
      expect(result.current.events.length).toBe(1)
    })

    const pollsBeforeBackground = mockGetEvents.mock.calls.length
    setAppState("background")
    expect(getAppState()).toBe("background")
    expect(result.current.events[0]?.id).toBe("event-1")
    expect(mockGetEvents).toHaveBeenCalledTimes(pollsBeforeBackground)
    assertNoDomGlobals()
    unmount()
  })
})
