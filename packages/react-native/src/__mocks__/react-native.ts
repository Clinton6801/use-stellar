import React from "react"
import mockAppState from "../test-utils/mocks/AppState"

type NodeProps = { children?: React.ReactNode; testID?: string }

function host(name: string) {
  return function Host(props: NodeProps) {
    return React.createElement(name, props, props.children)
  }
}

export const View = host("View")
export const Text = host("Text")
export const ScrollView = host("ScrollView")
export const Pressable = host("Pressable")
export const TouchableOpacity = host("TouchableOpacity")
export const FlatList = host("FlatList")
export const ActivityIndicator = host("ActivityIndicator")
export const SafeAreaView = host("SafeAreaView")
export const Image = host("Image")

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
  hairlineWidth: 1,
  flatten: (style: unknown) => style,
}

export const Platform = {
  OS: "ios" as const,
  select: <T>(spec: { ios?: T; android?: T; default?: T; native?: T }): T | undefined =>
    spec.ios ?? spec.native ?? spec.default,
}

export const AppState = mockAppState

export const NativeModules = {}
export const UIManager = { getViewManagerConfig: () => ({}) }
export const I18nManager = { isRTL: false }
export const Dimensions = {
  get: () => ({ width: 390, height: 844, scale: 2, fontScale: 1 }),
  addEventListener: () => ({ remove: () => undefined }),
}
export const PixelRatio = { get: () => 2 }
export const Alert = { alert: jest.fn() }
export const Linking = {
  addEventListener: () => ({ remove: () => undefined }),
  openURL: jest.fn(),
  canOpenURL: jest.fn().mockResolvedValue(true),
}
export const AccessibilityInfo = { isScreenReaderEnabled: async () => false }
export const processColor = (color: unknown) => color
export const requireNativeComponent = () => View
export class NativeEventEmitter {
  addListener() {
    return { remove() {} }
  }
}

export default {
  View,
  Text,
  StyleSheet,
  Platform,
  AppState,
}
