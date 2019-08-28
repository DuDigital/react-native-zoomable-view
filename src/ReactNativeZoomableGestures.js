"use strict";

import React, { Component } from "react";
import { View, PanResponder } from "react-native";
import ReactNativeZoomableView from './ReactNativeZoomableView';

export const swipeDirections = {
  SWIPE_UP: "SWIPE_UP",
  SWIPE_DOWN: "SWIPE_DOWN",
  SWIPE_LEFT: "SWIPE_LEFT",
  SWIPE_RIGHT: "SWIPE_RIGHT"
};

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
  detectSwipeUp: true,
  detectSwipeDown: true,
  detectSwipeLeft: true,
  detectSwipeRight: true
};

function isValidSwipe(
  velocity,
  velocityThreshold,
  directionalOffset,
  directionalOffsetThreshold
) {
  return (
    Math.abs(velocity) > velocityThreshold &&
    Math.abs(directionalOffset) < directionalOffsetThreshold
  );
}

class ReactNativeZoomableGestures extends React.Component {
 constructor(props, context) {
    super(props, context);
    this.swipeConfig = Object.assign(swipeConfig, props.config);

    const parent = ReactNativeZoomableView.prototype.parentHandleMoveShouldSetPanResponder.call(this);
  }

 static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps !== prevState) {
      this.swipeConfig = Object.assign(swipeConfig, nextProps.config);
    }
  }
/*

  /!**
   * Checks if we are in a swipe motion and if not ->
   * @param e
   * @param gestureState
   * @returns {boolean|*}
   *
   * @private
   *!/
  handleMoveShouldSetPanResponder = (e, gestureState) => {
    console.log('ICH BIN HHHH: ', e);
    if (super.handleMoveShouldSetPanResponder(e, gestureState)) {
      return true;
    }

    console.log('ICH MACH SAS: ', e);
    return (
      evt.nativeEvent.touches.length === 1 &&
      !this._gestureIsClick(gestureState) &&
      this._validateSwipe(gestureState)
    )
  }
*/

  /**
   * Checks the swipe and validates whether we should process it or not
   *
   * @param gestureState
   * @returns {*|boolean}
   *
   * @private
   */
  _validateSwipe(gestureState) {
    const {
      detectSwipeUp,
      detectSwipeDown,
      detectSwipeLeft,
      detectSwipeRight
    } = this.swipeConfig;
    const swipeDirection = this._getSwipeDirection(gestureState);
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;

    return (
      (detectSwipeUp && swipeDirection === SWIPE_UP) ||
      (detectSwipeDown && swipeDirection === SWIPE_DOWN) ||
      (detectSwipeLeft && swipeDirection === SWIPE_LEFT) ||
      (detectSwipeRight && swipeDirection === SWIPE_RIGHT)
    );
  }

  /**
   * Checks if the gesture is a just click
   *
   * @param gestureState
   * @returns {boolean}
   *
   * @private
   */
  _gestureIsClick(gestureState) {
    return Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;
  }

  /**
   * Triggers the swipe action, if we did swipe
   *
   * @param evt
   * @param gestureState
   * @private
   */
  _handlePanResponderEnd(evt, gestureState) {
    const swipeDirection = this._getSwipeDirection(gestureState);
    this._triggerSwipeHandlers(swipeDirection, gestureState);

    super._handlePanResponderEnd(evt, gestureState);
  }

  /**
   * Triggers the correct directional callback
   *
   * @param swipeDirection
   * @param gestureState
   * @private
   */
  _triggerSwipeHandlers(swipeDirection, gestureState) {
    const {
      onSwipe,
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight
    } = this.props;
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;

    // trigger the general onswipe callback
    if (onSwipe) {
      onSwipe(swipeDirection, gestureState);
    }

    // trigger the direction specific swipe callback
    switch (swipeDirection) {
      case SWIPE_LEFT:
        onSwipeLeft && onSwipeLeft(gestureState);
        break;
      case SWIPE_RIGHT:
        onSwipeRight && onSwipeRight(gestureState);
        break;
      case SWIPE_UP:
        onSwipeUp && onSwipeUp(gestureState);
        break;
      case SWIPE_DOWN:
        onSwipeDown && onSwipeDown(gestureState);
        break;
    }
  }

  /**
   * Calculates what direction the user swiped
   *
   * @param gestureState
   * @returns {*}
   * @private
   */
  _getSwipeDirection(gestureState) {
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    const { dx, dy } = gestureState;
    if (this._isValidHorizontalSwipe(gestureState)) {
      return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
    } else if (this._isValidVerticalSwipe(gestureState)) {
      return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
    }
    return null;
  }

  /**
   * Checks, whether the swipe was done in a horizontal fashion, respecting velocityThreshold limits
   *
   * @param gestureState
   * @returns {*}
   *
   * @private
   */
  _isValidHorizontalSwipe(gestureState) {
    const { vx, dy } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
  }

  /**
   * Checks, whether the swipe was done in a vertical fashion, respecting velocityThreshold limits
   *
   * @param gestureState
   * @returns {*}
   *
   * @private
   */
  _isValidVerticalSwipe(gestureState) {
    const { vy, dx } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
  }
}

export default ReactNativeZoomableGestures;
