export const mockLoadAccount = jest.fn()
export const mockAssetsCall = jest.fn()
export const mockClaimableCall = jest.fn()
export const mockTransactionCall = jest.fn()
export const mockFederationResolve = jest.fn()
export const mockSimulateTransaction = jest.fn()
export const mockGetEvents = jest.fn()
export const mockGetLatestLedger = jest.fn()

export const lastHorizonCtorArgs: { url?: string; opts?: { allowHttp?: boolean } } = {}

export const Horizon = {
  Server: jest.fn((url: string, opts?: { allowHttp?: boolean }) => {
    lastHorizonCtorArgs.url = url
    lastHorizonCtorArgs.opts = opts
    return {
      loadAccount: mockLoadAccount,
      assets: () => ({
        forCode: () => ({
          forIssuer: () => ({ call: mockAssetsCall }),
        }),
      }),
      claimableBalances: () => ({
        claimant: () => ({ call: mockClaimableCall }),
      }),
      transactions: () => ({
        transaction: () => ({ call: mockTransactionCall }),
      }),
    }
  }),
}

export const Federation = {
  Server: {
    resolve: (...args: unknown[]) => mockFederationResolve(...args),
  },
}

class MockScVal {
  constructor(
    public readonly type: string,
    public readonly value: unknown
  ) {}

  toXDR() {
    return `${this.type}:${String(this.value)}`
  }
}

export const xdr = {
  ScVal: Object.assign(MockScVal, {
    scvBool: (value: boolean) => new MockScVal("scvBool", value),
    scvI128: (value: bigint) => new MockScVal("scvI128", value),
    scvU128: (value: bigint) => new MockScVal("scvU128", value),
    scvAddress: (value: string) => new MockScVal("scvAddress", value),
    fromXDR: (raw: string) => new MockScVal("fromXDR", raw),
  }),
}

export const scValToNative = (value: { value?: unknown; decoded?: unknown }) =>
  value?.value ?? value?.decoded ?? value

export class Contract {
  constructor(public readonly contractId: string) {}
  call(method: string, ...args: unknown[]) {
    return { method, args }
  }
}

export class Account {
  constructor(
    public readonly accountId: string,
    public readonly sequence: string
  ) {}
}

export class TransactionBuilder {
  addOperation() {
    return this
  }
  setTimeout() {
    return this
  }
  build() {
    return { source: "mock" }
  }
}

export const BASE_FEE = "100"

export const SorobanRpc = {
  Server: jest.fn(() => ({
    simulateTransaction: mockSimulateTransaction,
    getEvents: mockGetEvents,
    getLatestLedger: mockGetLatestLedger,
  })),
  Api: {
    isSimulationError: (result: unknown) =>
      typeof result === "object" && result !== null && "error" in result && !("result" in result),
    isSimulationSuccess: (result: unknown) =>
      typeof result === "object" && result !== null && "result" in result,
  },
}

export function resetStellarSdkMocks() {
  mockLoadAccount.mockReset()
  mockAssetsCall.mockReset()
  mockClaimableCall.mockReset()
  mockTransactionCall.mockReset()
  mockFederationResolve.mockReset()
  mockSimulateTransaction.mockReset()
  mockGetEvents.mockReset()
  mockGetLatestLedger.mockReset()
  lastHorizonCtorArgs.url = undefined
  lastHorizonCtorArgs.opts = undefined
}
