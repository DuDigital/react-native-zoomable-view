Warning: Not production ready yet!

# react-native-zoomable-view

A view component for react-native with pinch to zoom, tap to move and double tap to zoom capability.

Readme: 
Coming soon

## Props

### Events

| name | description | params | expected return |
| ---- | ----------- | ------ | --------------- |
| onStartShouldSetPanResponder | description | event, gestureState, zoomableViewEventObject, baseComponentResult | {boolean} whether panresponder should be set or not |
| onMoveShouldSetPanResponder | description | event, gestureState, zoomableViewEventObject, baseComponentResult | {boolean} whether panresponder should be set or not |
| onPanResponderGrant | description | event, gestureState, zoomableViewEventObject | void |
| onPanResponderEnd | Will be called when gesture ends | event, gestureState, zoomableViewEventObject | void |
| onPanResponderMove | Will be called when user moves while touching | event, gestureState, zoomableViewEventObject | void |
| onDoubleTap | Will be called, when user double taps the screen | event, gestureState, zoomableViewEventObject | void |
| onShiftingBefore | Will be called, when user taps and moves the view, but before our view movement work kicks in (so this is the place to interrupt movement, if you need to)  | event, gestureState, zoomableViewEventObject |  {boolean} if this returns false, ZoomableView will not process the shift, otherwise it will |
| onShiftingAfter | Will be called, when user taps and moves the view, but after the values have changed already | event, gestureState, zoomableViewEventObject | void |
| onShiftingEnd | Will be called, when user stops a tap and move gesture | event, gestureState, zoomableViewEventObject | void |
| onPinchMovementBefore | Will be called, while the user pinches the screen, but before our zoom work kicks in (so this is the place to interrupt zooming, if you need to) | event, gestureState, zoomableViewEventObject | {boolean} if this returns false, ZoomableView will not process the pinch, otherwise it will |
| onPinchMovementAfter | Will be called, while the user pinches the screen, but after the values have changed already | event, gestureState, zoomableViewEventObject | {boolean} if this returns false, ZoomableView will not process the pinch, otherwise it will |
| onPinchEnd | Will be called, when the pinch has ended | event, gestureState, zoomableViewEventObject | {boolean} if this returns false, ZoomableView will not process the pinch, otherwise it will |


## zoomableViewEventObject

The zoomableViewEventObject object is attached to every event and represents the current state of our zoomable view.
```json
   {
      zoomLevel: number,         // current level of zooming (usually a value between minZoom and maxZoom)
      offsetX: number,           // current offset left
      offsetY: number,           // current offset top
      lastScale: number,         // last zoom level (before we started the movement)
      lastX: number,             // last offset left (before we started the movement)
      lastY: number,             // last offset top (before we started the movement)
      lastMovePinch: boolean,    // information if a movement is going on
   }
```