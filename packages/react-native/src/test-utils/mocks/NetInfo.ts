export interface NetInfoState {
  isConnected: boolean | null
  isInternetReachable: boolean | null
  type: string
}

type NetInfoListener = (state: NetInfoState) => void

const mockNetInfo = {
  state: {
    isConnected: true,
    isInternetReachable: true,
    type: "wifi",
  } as NetInfoState,
  listeners: new Set<NetInfoListener>(),
}

export function setOnline(online: boolean): void {
  mockNetInfo.state = {
    isConnected: online,
    isInternetReachable: online,
    type: online ? "wifi" : "none",
  }
  mockNetInfo.listeners.forEach(listener => {
    listener(mockNetInfo.state)
  })
}

export function getNetInfoState(): NetInfoState {
  return mockNetInfo.state
}

export function getNetInfoListenerCount(): number {
  return mockNetInfo.listeners.size
}

export function resetNetInfoMock(): void {
  mockNetInfo.state = { isConnected: true, isInternetReachable: true, type: "wifi" }
  mockNetInfo.listeners.clear()
}

export function addEventListener(listener: NetInfoListener) {
  mockNetInfo.listeners.add(listener)
  return () => {
    mockNetInfo.listeners.delete(listener)
  }
}

export function fetch(): Promise<NetInfoState> {
  return Promise.resolve(mockNetInfo.state)
}

export default {
  addEventListener,
  fetch,
}
