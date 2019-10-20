declare module '@dudigital/react-native-zoomable-view' {
  import React from 'react';
  import { PanResponderGestureState, ViewProps } from 'react-native';

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
    lastZoomLevel: number;
    lastX: number;
    lastY: number;
    distanceBottom: number;
    distanceLeft: number;
    distanceRight: number;
    distanceTop: number;
    lastMovePinch: boolean;
    originalHeight: number;
    originalWidth: number;
  }

  export interface ReactNativeZoomableViewProps extends ViewProps {
    zoomEnabled?: boolean;
    initialZoom?: number;
    maxZoom?: number;
    minZoom?: number;
    doubleTapDelay?: number;
    bindToBorders?: boolean;
    zoomStep?: number;
    pinchToZoomInSensitivity?: number;
    pinchToZoomOutSensitivity?: number;
    zoomCenteringLevelDistance?: number;
    movementSensibility?: number;
    initialOffsetX?: number;
    initialOffsetY?: number;
    longPressDuration?: number;
    onDoubleTapBefore?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent) => void;
    onDoubleTapAfter?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent) => void;
    onShiftingBefore?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent) => boolean;
    onShiftingAfter?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent) => void;
    onShiftingEnd?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent) => void;
    onZoomBefore?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent) => boolean;
    onZoomAfter?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent) => boolean;
    onZoomEnd?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent) => boolean;
    onLongPress?: (event: Event, gestureState: PanResponderGestureState) => void;
    onStartShouldSetPanResponder?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent, any) => boolean;
    onMoveShouldSetPanResponder?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent, any) => boolean;
    onPanResponderGrant?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent) => void;
    onPanResponderEnd?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent) => void;
    onPanResponderMove?: (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: ZoomableViewEvent) => void;
  }

  export class ReactNativeZoomableView extends React.PureComponent<ReactNativeZoomableViewProps> {}

  export interface ReactNativeZoomableViewWithGesturesProps extends ReactNativeZoomableViewProps {
    swipeLengthThreshold?: number,
    swipeVelocityThreshold?: number,
    swipeDirectionalThreshold?: number,
    swipeMinZoom?: number,
    swipeMaxZoom?: number,
    swipeDisabled?: boolean,
    onSwipe?: (swipeDirection: SwipeDirection, gestureState: PanResponderGestureState) => void,
    onSwipeUp?: (gestureState: PanResponderGestureState) => void,
    onSwipeDown?: (gestureState: PanResponderGestureState) => void,
    onSwipeLeft?: (gestureState: PanResponderGestureState) => void,
    onSwipeRight?: (gestureState: PanResponderGestureState) => void,
  }

  export class ReactNativeZoomableViewWithGestures extends ReactNativeZoomableView {}
}

declare module '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView' {
  import { ReactNativeZoomableView } from '@dudigital/react-native-zoomable-view';
  export default ReactNativeZoomableView;
}

declare module '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableViewWithGestures' {
  import { ReactNativeZoomableViewWithGestures } from '@dudigital/react-native-zoomable-view';
  export default ReactNativeZoomableViewWithGestures;
}
