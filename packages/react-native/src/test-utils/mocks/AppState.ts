type AppStateStatus = "active" | "background" | "inactive" | "unknown" | "extension"

type AppStateListener = (state: AppStateStatus) => void

const mockAppState = {
  currentState: "active" as AppStateStatus,
  listeners: new Set<AppStateListener>(),
  addEventListener(_type: "change", listener: AppStateListener) {
    this.listeners.add(listener)
    return {
      remove: () => {
        this.listeners.delete(listener)
      },
    }
  },
  removeEventListener(_type: "change", listener: AppStateListener) {
    this.listeners.delete(listener)
  },
  reset() {
    this.currentState = "active"
    this.listeners.clear()
  },
}

export function setAppState(state: AppStateStatus): void {
  mockAppState.currentState = state
  mockAppState.listeners.forEach(listener => {
    listener(state)
  })
}

export function getAppState(): AppStateStatus {
  return mockAppState.currentState
}

export function getAppStateListenerCount(): number {
  return mockAppState.listeners.size
}

export function resetAppStateMock(): void {
  mockAppState.reset()
}

export default mockAppState
