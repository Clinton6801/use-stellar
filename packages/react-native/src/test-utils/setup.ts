import { resetAppStateMock, resetNetInfoMock } from "./mocks"
import { resetStellarSdkMocks } from "../__mocks__/@stellar/stellar-sdk"

beforeEach(() => {
  resetAppStateMock()
  resetNetInfoMock()
  resetStellarSdkMocks()
})

afterEach(() => {
  jest.clearAllTimers()
})
