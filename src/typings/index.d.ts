declare module '@openspacelabs/react-native-zoomable-view' {
  import React from 'react';
  import {
    GestureResponderEvent,
    PanResponderGestureState,
    ViewProps,
  } from 'react-native';

  export enum SwipeDirection {
    SWIPE_UP = 'SWIPE_UP',
    SWIPE_DOWN = 'SWIPE_DOWN',
    SWIPE_LEFT = 'SWIPE_LEFT',
    SWIPE_RIGHT = 'SWIPE_RIGHT',
  }

  export interface ZoomableViewEvent {
    zoomLevel: number;
    offsetX: number;
    offsetY: number;
    originalHeight: number;
    originalWidth: number;
    originalPageX: number;
    originalPageY: number;
  }

  export interface ReactNativeZoomableViewProps extends ViewProps {
    // options
    zoomEnabled?: boolean;
    initialZoom?: number;
    initialOffsetX?: number;
    initialOffsetY?: number;
    contentWidth?: number;
    contentHeight?: number;
    maxZoom?: number;
    minZoom?: number;
    doubleTapDelay?: number;
    doubleTapZoomToCenter?: boolean;
    bindToBorders?: boolean;
    zoomStep?: number;
    pinchToZoomInSensitivity?: number;
    pinchToZoomOutSensitivity?: number;
    movementSensibility?: number;
    longPressDuration?: number;
    captureEvent?: boolean;
    style?: any;

    // debug
    debug?: boolean;

    // callbacks
    onTransform?: (zoomableViewEventObject: ZoomableViewEvent) => void;
    onSingleTap?: (
      event: GestureResponderEvent,
      zoomableViewEventObject: ZoomableViewEvent
    ) => void;
    onDoubleTapBefore?: (
      event: GestureResponderEvent,
      zoomableViewEventObject: ZoomableViewEvent
    ) => void;
    onDoubleTapAfter?: (
      event: GestureResponderEvent,
      zoomableViewEventObject: ZoomableViewEvent
    ) => void;
    onShiftingBefore?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => boolean;
    onShiftingAfter?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => boolean;
    onShiftingEnd?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => void;
    onZoomBefore?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => boolean | void;
    onZoomAfter?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => void;
    onZoomEnd?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => void;
    onLongPress?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => void;
    onStartShouldSetPanResponder?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent,
      baseComponentResult: boolean
    ) => boolean;
    onMoveShouldSetPanResponder?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent,
      baseComponentResult: boolean
    ) => boolean;
    onPanResponderGrant?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => void;
    onPanResponderEnd?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => void;
    onPanResponderMove?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => boolean;
    onPanResponderTerminate?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => void;
    onPanResponderTerminationRequest?: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      zoomableViewEventObject: ZoomableViewEvent
    ) => boolean;
  }

  export interface Vec2D {
    x: number;
    y: number;
  }

  export interface TouchPoint extends Vec2D {
    id: string;
    isSecondTap?: boolean;
  }

  export interface ReactNativeZoomableViewState {
    touches: TouchPoint[];
    originalWidth: number;
    originalHeight: number;
    originalPageX: number;
    originalPageY: number;
    debugPoints: undefined | Vec2D[];
  }

  export class ReactNativeZoomableView extends React.PureComponent<ReactNativeZoomableViewProps> {
    // events
    zoomTo: (newZoomLevel: number, bindToBorders: boolean) => Promise<void>;
    zoomBy: (zoomLevelChange: number, bindToBorders: boolean) => Promise<void>;
    moveTo: (
      newOffsetX: number,
      newOffsetY: number,
      bindToBorders: boolean
    ) => Promise<boolean>;
    moveBy: (
      offsetChangeX: number,
      offsetChangeY: number,
      bindToBorders: boolean
    ) => Promise<boolean>;
  }

  export interface ReactNativeZoomableViewWithGesturesProps
    extends ReactNativeZoomableViewProps {
    swipeLengthThreshold?: number;
    swipeVelocityThreshold?: number;
    swipeDirectionalThreshold?: number;
    swipeMinZoom?: number;
    swipeMaxZoom?: number;
    swipeDisabled?: boolean;
    onSwipe?: (
      swipeDirection: SwipeDirection,
      gestureState: PanResponderGestureState
    ) => void;
    onSwipeUp?: (gestureState: PanResponderGestureState) => void;
    onSwipeDown?: (gestureState: PanResponderGestureState) => void;
    onSwipeLeft?: (gestureState: PanResponderGestureState) => void;
    onSwipeRight?: (gestureState: PanResponderGestureState) => void;
  }

  export class ReactNativeZoomableViewWithGestures extends ReactNativeZoomableView {}
}
