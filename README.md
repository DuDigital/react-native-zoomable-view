# react-native-zoomable-view

A view component for react-native with pinch to zoom, tap to move and double tap to zoom capability.
You can zoom everything, from normal images, text and more complex nested views.

We are using this component already in production in two of our projects, but for quality assurance sake, please consider this component beta.
We are happy to hear from you about bugs, issues and would also appreciate your pull requests, if you've made improvements or fixed bugs.

## Preview

![](https://thumbs.gfycat.com/PalatableMeanGnat-size_restricted.gif)

## Getting started

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Props](#props)
- [Events](#events)
- [Pan Responder Hooks](#pan-responder-hooks)
- [Example](#example)
- [Expo Snack Example](#expo-snack-example)
- [Example Repo](#example-repo)

### Installation

`$ npm install @dudigital/react-native-zoomable-view --save`

or 

`$ yarn add @dudigital/react-native-zoomable-view`

### Basic Usage

This component is based on react-natives View, enhanced by panresponders and other events to make it zoomable.
Therefore no platform specific configuration needs to be done.

Just use it as a drop in component instead of a normal view.

Import ReactNativeZoomableView:
```JSX
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
```

Use the component:
```JSX
<ReactNativeZoomableView
   maxZoom={1.5}
   minZoom={0.5}
   zoomStep={0.5}
   initialZoom={1}
   bindToBorders={true}
   onZoomAfter={this.logOutZoomState}
   style={{
      padding: 10,
      backgroundColor: 'red',
   }}
>
   <Text>This is the content</Text>
</ReactNativeZoomableView>
```

### Example

Here is a full drop in example you can use in Expo, after installing the package.

```JSX
import React from 'react';
import { View, Image } from 'react-native';
import { ReactNativeZoomableView } from '@dudigital/react-native-zoomable-view';

export default class App extends React.Component {
  /**
   * Log out an example event after zooming
   *
   * @param event
   * @param gestureState
   * @param zoomableViewEventObject
   */
  logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
    console.log('');
    console.log('');
    console.log('-------------');
    console.log('Event: ', event);
    console.log('GestureState: ', gestureState);
    console.log('ZoomableEventObject: ', zoomableViewEventObject);
    console.log('');
    console.log(`Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ReactNativeZoomableView
          maxZoom={1.5}
          minZoom={0.5}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders={true}
          onZoomAfter={this.logOutZoomState}
          style={{
            padding: 10,
            backgroundColor: 'red',
          }}
        >
          <Image style={{ flex: 1, width: null, height: '100%' }}
                 source={require('./image.jpg')}
                 resizeMode="contain" />
        </ReactNativeZoomableView>
      </View>
    );
  }
}
```

### Expo Snack Example

https://snack.expo.io/SkltQtr8Q

### Example Repo

https://github.com/DuDigital/react-native-zoomable-view-example


### Props

#### Options

These options can be used to limit and change the zoom behavior.

| name | type | description | default |
| ---- | ----------- | ------ | --------------- |
| zoomEnabled | boolean | Can be used to enable or disable the zooming dynamically | true |
| initialZoom | number | Initial zoom level on startup | 1.0 |
| maxZoom | number | Maximum possible zoom level (zoom in). Can be set to `null` to allow unlimited zooming | 1.5 |
| minZoom | number | Minimum possible zoom level (zoom out) | 0.5 |
| doubleTapDelay | number  | How much delay will still be recognized as double press (ms) | 300 |
| doubleTapZoomToCenter | boolean | If true, double tapping will always zoom to center of View instead of the direction it was double tapped in
| bindToBorders | boolean | If true, it makes sure the object stays within box borders | true |
| zoomStep | number | How much zoom should be applied on double tap | 0.5 |
| pinchToZoomInSensitivity | number | the level of resistance (sensitivity) to zoom in (0 - 10) - higher is less sensitive | 3 |
| pinchToZoomOutSensitivity | number | the level of resistance (sensitivity) to zoom out (0 - 10) - higher is less sensitive | 1 |
| zoomCenteringLevelDistance | number | the (zoom level - 0 - maxZoom) distance for pinch to zoom actions until they are shifted on new pinch to zoom center - higher means it centeres slower | 0.5 |
| movementSensibility | number | how resistant should shifting the view around be? (0.5 - 5) - higher is less sensitive | 1.9 |
| initialOffsetX | number | The horizontal offset the image should start at | 0 |
| initialOffsetY | number | The vertical offset the image should start at | 0 |
| longPressDuration | number | Duration in ms until a press is considered a long press | 700 |
| captureEvent | boolean | Defines whether the pan responder of the parent element should be captured. (useful for react-native modals, set it to true) | false |

#### Callbacks

These events can be used to work with data after specific events.

| name | description | params | expected return |
| ---- | ----------- | ------ | --------------- |
| onDoubleTapBefore | Will be called, at the start of a double tap | event, gestureState, zoomableViewEventObject | void |
| onDoubleTapAfter | Will be called at the end of a double tap | event, gestureState, zoomableViewEventObject | void |
| onShiftingBefore | Will be called, when user taps and moves the view, but before our view movement work kicks in (so this is the place to interrupt movement, if you need to)  | event, gestureState, zoomableViewEventObject |  {boolean} if this returns true, ZoomableView will not process the shift, otherwise it will |
| onShiftingAfter | Will be called, when user taps and moves the view, but after the values have changed already | event, gestureState, zoomableViewEventObject | void |
| onShiftingEnd | Will be called, when user stops a tap and move gesture | event, gestureState, zoomableViewEventObject | void |
| onZoomBefore | Will be called, while the user pinches the screen, but before our zoom work kicks in (so this is the place to interrupt zooming, if you need to) | event, gestureState, zoomableViewEventObject | {boolean} if this returns true, ZoomableView will not process the pinch, otherwise it will |
| onZoomAfter | Will be called, while the user pinches the screen, but after the values have changed already | event, gestureState, zoomableViewEventObject | {boolean} if this returns true, ZoomableView will not process the pinch, otherwise it will |
| onZoomEnd | Will be called after pinchzooming has ended | event, gestureState, zoomableViewEventObject | {boolean} if this returns true, ZoomableView will not process the pinch, otherwise it will |
| onLongPress | Will be called after the user pressed on the image for a while | event, gestureState | void | 


#### Events

The following events allow you to control the ZoomableView zoom level & position from your component.
(think of control buttons, ...)

You can find an implementation example in the example repo: https://github.com/DuDigital/react-native-zoomable-view-example

| name | description | params | expected return |
| ---- | ----------- | ------ | --------------- |
| zoomTo | Changes the zoom level to a specific number | newZoomLevel: number, bindToBorders = true | Promise<bool> |
| zoomBy | Changes the zoom level relative to the current level (use positive numbers to zoom in, negative numbers to zoom out) | zoomLevelChange: number, bindToBorders = true | Promise<bool> |
| moveTo | Shifts the zoomed part to a specific point (in px relative to x: 0, y: 0) | newOffsetX: number, newOffsetY: number, bindToBorders = true | Promise<void> |
| moveBy | Shifts the zoomed part by a specific pixel number | newOffsetX: number, newOffsetY: number, bindToBorders = true | Promise<void> |


**Example:**

```TSX

export default function App() {
  // you will need a reference to the ReactNativeZoomableView component
  const zoomableViewRef = createRef<ReactNativeZoomableView>();

  return (
    <View style={styles.container}>
      <View style={styles.zoomWrapper}>
        <ReactNativeZoomableView
          ref={zoomableViewRef}
          bindToBorders={true}
        >
          <Text style={styles.caption}>HelloWorld</Text>
        </ReactNativeZoomableView>
      </View>

      <View style={styles.controlWrapperLeft}>
        {/* Here you see some examples of moveBy */}
        <Button onPress={() => zoomableViewRef.current!.moveBy(-30, 0)} title="⬅️" />
        <Button onPress={() => zoomableViewRef.current!.moveBy(30, 0)} title="➡️" />
        <Button onPress={() => zoomableViewRef.current!.moveBy(0, -30)} title="⬆️" />
        <Button onPress={() => zoomableViewRef.current!.moveBy(0, 30)} title="⬇️" />

        {/* Here you see an example of moveTo */}
        <Button onPress={() => zoomableViewRef.current!.moveTo(300, 200)} title="Move to" />
      </View>

      <View style={styles.controlWrapperRight}>
        {/* Here you see examples of zoomBy */}
        <Button onPress={() => zoomableViewRef.current!.zoomBy(-0.1)} title="-" />
        <Button onPress={() => zoomableViewRef.current!.zoomBy(0.1)} title="+" />

        {/* Here you see an example of zoomTo */}
        <Button onPress={() => zoomableViewRef.current!.zoomTo(1)} title="reset" />
      </View>
    </View>
  );
}

```


#### Pan Responder Hooks

Sometimes you need to change deeper level behavior, so we prepared these panresponder hooks for you.

| name | description | params | expected return |
| ---- | ----------- | ------ | --------------- |
| onStartShouldSetPanResponder | description | event, gestureState, zoomableViewEventObject, baseComponentResult | {boolean} whether panresponder should be set or not |
| onMoveShouldSetPanResponder | description | event, gestureState, zoomableViewEventObject, baseComponentResult | {boolean} whether panresponder should be set or not |
| onPanResponderGrant | description | event, gestureState, zoomableViewEventObject | void |
| onPanResponderEnd | Will be called when gesture ends (more accurately, on pan responder "release") | event, gestureState, zoomableViewEventObject | void |
| onPanResponderTerminate | Will be called when the gesture is force-interrupted by another handler | event, gestureState, zoomableViewEventObject | void |
| onPanResponderTerminationRequest | Callback asking whether the gesture should be interrupted by another handler (**iOS only** due to https://github.com/facebook/react-native/issues/27778, https://github.com/facebook/react-native/issues/5696, ...) | event, gestureState, zoomableViewEventObject | void |
| onPanResponderMove | Will be called when user moves while touching | event, gestureState, zoomableViewEventObject | void |

### zoomableViewEventObject

The zoomableViewEventObject object is attached to every event and represents the current state of our zoomable view.
```
   {
      zoomLevel: number,         // current level of zooming (usually a value between minZoom and maxZoom)
      offsetX: number,           // current offset left
      offsetY: number,           // current offset top
      lastZoomLevel: number,     // last zoom level (before we started the movement)
      lastX: number,             // last offset left (before we started the movement)
      lastY: number,             // last offset top (before we started the movement)
      lastMovePinch: boolean,    // information if a movement is going on
      distanceBottom: number,    // view offset from bottom border
      distanceLeft: number,      // view offset from left border
      distanceRight: number,     // view offset from right border
      distanceTop: number,       // view offset from bottom border
      lastMovePinch: boolean,    // boolean, that states if this movement was a pinch movement
      originalHeight: number,    // original height of the outer view
      originalWidth: number,     // original width of the outer view
      captureEvent: boolean,     // should the panresponder be taken away from parent component (used for react-native modals) 
   }
```

## Special configurations

### React Native Modal

To make this work with react-native modals, you have to set the `captureEvent` prop to `true`.
Otherwise the modal will stop the pinch2zoom event and it will not work.


## TODO

* Improve documentation
* Add examples for more complex scenarios (react-native-zoomable-view in a swiper)
* TESTS

## Contributing

A lot of people are now using react-native-zoomable-view and there are always smaller things to improve and change.<br />
Therefore any contributions are more than welcome! <3<br /><br />

Are you looking to help out and improve this project?<br />
Either submit Pull requests with awesome changes or reach out to me on Twitter: https://twitter.com/SimonEritsch<br />
Helping hands are always appreciated! :)

### How to contribute

Just clone the example repository: https://github.com/DuDigital/react-native-zoomable-view-example

Adjust the package in the typescript files in `node_modules/@dudigital/react-native-zoomable-view` folder, while running `npm transpile` **in that folder** as well.
(the transpile command will make sure to transpile the typescript code into javascript)

// We definitely need a better process here. If you have any ideas - please open an issue or PR about a solution. ;)
// We would really appreciate it
