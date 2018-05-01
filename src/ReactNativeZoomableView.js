import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  PanResponder,
} from 'react-native';

class ReactNativeZoomableView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zoomLevel: props.initialZoom,
      lastScale: 1,
      offsetX: 0,
      offsetY: 0,
      lastX: 0,
      lastY: 0,
      lastMovePinch: false,
    };

    this.distance = 150;

    this.gestureType = null;
  }

  componentWillMount() {
    this.gestureHandlers = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: evt => false,
      onShouldBlockNativeResponder: evt => false,
    });
  }

  /**
   * Returns additional information about components current state for external event hooks
   *
   * @returns {{}}
   * @private
   */
  _getZoomableViewEventObject() {
    return {
      ...this.state,
    };
  }

  /**
   * Get the original box dimensions and save them for later use.
   * (They will be used to calculate boxBorders)
   *
   * @param layoutEvent
   * @private
   */
  _getBoxDimensions = (layoutEvent) => {
    const { x, y, height, width } = layoutEvent.nativeEvent.layout;

    this.setState({
      originalWidth: width,
      originalHeight: height,
    });
  };

  /**
   * Handles the start of touch events and checks for taps
   *
   * @param e
   * @param gestureState
   * @returns {boolean}
   *
   * @private
   */
  _handleStartShouldSetPanResponder = (e, gestureState) => {
    this._doubleTapCheck(e, gestureState);

    if (this.props.onStartShouldSetPanResponder) {
      this.props.onStartShouldSetPanResponder(e, gestureState, this._getZoomableViewEventObject(), false);
    }

    return false;
  };

  /**
   * Checks if the movement responder should be triggered
   *
   * @param e
   * @param gestureState
   * @returns {Boolean|boolean}
   */
  _handleMoveShouldSetPanResponder = (e, gestureState) => {
    let baseComponentResult = this.props.zoomEnabled
      && (Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2 || gestureState.numberActiveTouches === 2);

    if (this.props.onMoveShouldSetPanResponder) {
      baseComponentResult = this.props.onMoveShouldSetPanResponder(e, gestureState, this._getZoomableViewEventObject(), baseComponentResult);
    }

    return baseComponentResult;
  };

  /**
   * Calculates pinch distance
   *
   * @param e
   * @param gestureState
   * @private
   */
  _handlePanResponderGrant = (e, gestureState) => {
    if (gestureState.numberActiveTouches === 2) {
      let dx = Math.abs(e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX);
      let dy = Math.abs(e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY);

      let distant = Math.sqrt(dx * dx + dy * dy);
      this.distance = distant;
    }

    if (this.props.onPanResponderGrant) {
      this.props.onPanResponderGrant(e, gestureState, this._getZoomableViewEventObject());
    }
  };

  /**
   * Handles the end of touch events
   *
   * @param e
   * @param gestureState
   *
   * @private
   */
  _handlePanResponderEnd = (e, gestureState) => {
    this.setState({
      lastX: this.state.offsetX,
      lastY: this.state.offsetY,
      lastScale: this.state.zoomLevel,
    });

    this.lastPressHolder = null;

    if (this.props.onPanResponderEnd) {
      this.props.onPanResponderEnd(e, gestureState, this._getZoomableViewEventObject());
    }

    if (this.gestureType === 'pinch') {
      if (this.props.onPinchEnd) {
        this.props.onPinchEnd(e, gestureState, this._getZoomableViewEventObject());
      }
    } else if (this.gestureType === 'shift') {
      if (this.props.onShiftingEnd) {
        this.props.onShiftingEnd(e, gestureState, this._getZoomableViewEventObject());
      }
    }

    this.gestureType = null;
  };

  /**
   * Takes a single offset value and calculates the correct offset value within our view to make
   *
   * @param offsetValue
   * @param containerSize
   * @param elementSize
   * @param zoomLevel
   * @param forceNumericReturn
   *
   * @returns {number}
   */
  _getBoundOffsetValue(offsetValue: number, containerSize: number, elementSize: number, zoomLevel: number, forceNumericReturn = false) {
    const zoomLevelOffsetValue = (zoomLevel * offsetValue);

    const containerToScaledElementRatioSub = 1 - (containerSize / elementSize);
    const halfLengthPlusScaledHalf = 0.5 + (0.5 / zoomLevel);
    const startBorder = containerSize * containerToScaledElementRatioSub * halfLengthPlusScaledHalf;
    const endBorder = (containerSize + startBorder - containerSize) * -1;

    // calculate distance to start and end borders
    const distanceToStart = (offsetValue - startBorder);
    const distanceToEnd = (offsetValue + startBorder) * -1;

    // if both sides (before and after the element) have a positive distance
    // => (our zoomed content is smaller than the frame)
    // => so center it
    if (containerSize > elementSize) {
      return ((containerSize / 2) - (elementSize / 2) / zoomLevel);
    }

    // if everything above failed
    // => (one side is outside of the borders)
    // => find out which one it is and make sure it is 0
    if (distanceToStart > 0) {
      return startBorder;
    }

    // if there is distance to the end border
    // => (it is outside of the box)
    // => adjust offset to make sure it stays within
    if (distanceToEnd > 0) {
      return endBorder;
    }

    // if everything above failed
    // => (everything is within borders)
    // => just return the original offset value
    return offsetValue;
  }

  /**
   * Takes a change object (that is going to be used in setState) and makes sure offsetX and
   * offsetY are within our view borders. If that is not the case, they will be corrected.
   *
   * @param changeObj the object that is going to be modified.
   *    Needs to contain at least the following elements:
   *    {
   *      zoomLevel: numeric,
   *      offsetX: numeric,
   *      offsetY: numeric,
   *    }
   * @private
   */
  _bindOffsetValuesToBorders(changeObj, bindToBorders = null, forceNumericReturn = false) {
    // if bindToBorders is disabled -> nothing do here
    if (bindToBorders === false ||
      (bindToBorders === null && !this.props.bindToBorders)) {
      return changeObj;
    }

    const { originalWidth, originalHeight } = this.state;

    const currentElementWidth = originalWidth * changeObj.zoomLevel;
    const currentElementHeight = originalHeight * changeObj.zoomLevel;

    // make sure that view doesn't go out of borders
    const offsetXBound = this._getBoundOffsetValue(changeObj.offsetX, originalWidth, currentElementWidth, changeObj.zoomLevel, forceNumericReturn);
    changeObj.offsetX = offsetXBound;

    const offsetYBound = this._getBoundOffsetValue(changeObj.offsetY, originalHeight, currentElementHeight, changeObj.zoomLevel, forceNumericReturn);
    changeObj.offsetY = offsetYBound;

    return changeObj;
  }

  /**
   * Handles the acutal movement of our pan responder
   *
   * @param e
   * @param gestureState
   *
   * @private
   */
  _handlePanResponderMove = (e, gestureState) => {
    if (this.props.onPanResponderMove) {
      if (this.props.onPanResponderMove(e, gestureState, this._getZoomableViewEventObject())) {
        return false;
      }
    }

    if (gestureState.numberActiveTouches === 2) {
      this.gestureType = 'pinch';
      this._handlePinching(e, gestureState);
    }
    else if (gestureState.numberActiveTouches === 1) {
      this.gestureType = 'shift';
      this._handleMovement(e, gestureState);
    }
  };

  /**
   * Handles the pinch movement and zooming
   *
   * @param e
   * @param gestureState
   *
   * @private
   */
  _handlePinching = (e, gestureState) => {
    const { maxZoom, minZoom } = this.props;

    let dx = Math.abs(e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX);
    let dy = Math.abs(e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY);
    let distant = Math.sqrt(dx * dx + dy * dy);

    if (this.props.onPinchMovementStart) {
      if (this.props.onPinchMovementStart(e, gestureState, this._getZoomableViewEventObject())) {
        return false;
      }
    }

    // let zoomLevel = (distant / (zoomLevelFactor / 1500)) * this.state.lastScale;
    let zoomLevel = distant / this.distance * this.state.lastScale;
    if (zoomLevel > maxZoom) {
      zoomLevel = maxZoom;
    }

    if (zoomLevel < minZoom) {
      zoomLevel = minZoom;
    }

    // define the changeObject and make sure the offset values are bound to view
    const changeStateObj = this._bindOffsetValuesToBorders({
      zoomLevel,
      lastMovePinch: true,
      offsetX: this.state.lastX,
      offsetY: this.state.lastY,
    }, null);

    this.setState(changeStateObj, () => {
      if (this.props.onPinchMovementAfter) {
        this.props.onPinchMovementAfter(e, gestureState, this._getZoomableViewEventObject());
      }
    });
  };

  _getSwipeDistanceAndDirection = (e, gestureState) => {

    const { vx, dy } = gestureState;
  }

  /**
   * Handles movement by tap and move
   *
   * @param e
   * @param gestureState
   *
   * @private
   */
  _handleMovement = (e, gestureState) => {
    if (this.state.lastMovePinch) {
      gestureState.dx = 0;
      gestureState.dy = 0;
    }
    let offsetX = this.state.lastX + gestureState.dx / this.state.zoomLevel;
    let offsetY = this.state.lastY + gestureState.dy / this.state.zoomLevel;

    if (this.props.onShiftingBefore) {
      if (this.props.onShiftingBefore(e, gestureState, this._getZoomableViewEventObject())) {
        return false;
      }
    }

    const changeStateObj = this._bindOffsetValuesToBorders({
      lastMovePinch: false,
      zoomLevel: this.state.zoomLevel,
      offsetX,
      offsetY,
    }, null);

    this.setState(changeStateObj, () => {
      if (this.props.onShiftingAfter) {
        if (this.props.onShiftingAfter(e, gestureState, this._getZoomableViewEventObject())) {
          return false;
        }
      }
    });
  };

  /**
   * Wraps the check for double tap
   *
   * @param e
   * @param gestureState
   *
   * @private
   */
  _doubleTapCheck(e, gestureState) {
    const now = new Date().getTime();

    if (this.lastPressHolder && (now - this.lastPressHolder) < this.props.doubleTapDelay) {
      delete this.lastPressHolder;
      this._handleDoubleTap(e, gestureState);
    }
    else {
      this.lastPressHolder = now;
    }
  }

  /**
   * Handles the double tap event
   *
   * @param event
   * @param gestureState
   *
   * @private
   */
  _handleDoubleTap(event, gestureState) {
    // ignore more than 2 touches
    if (gestureState.numberActiveTouches > 1) {
      return;
    }

    if (this.props.onDoubleTap) {
      if (this.props.onDoubleTap(e, gestureState, this._getZoomableViewEventObject())) {
        return false;
      }
    }

    const nextZoomStep = this._getNextZoomStep();

    this._zoomToLocation(
      event.nativeEvent.locationX,
      event.nativeEvent.locationY,
      nextZoomStep,
    );
  }


  /**
   * Returns the next zoom step based on current step and zoomStep property.
   * If we are zoomed all the way in -> return to initialzoom
   *
   * @returns {*}
   */
  _getNextZoomStep() {
    const { zoomStep, maxZoom, initialZoom } = this.props;
    const { zoomLevel } = this.state;

    if (zoomLevel === maxZoom) {
      return initialZoom;
    }

    let nextZoomStep = zoomLevel + (zoomLevel * zoomStep);

    if (nextZoomStep > maxZoom) {
      return maxZoom;
    }

    return nextZoomStep;
  }

  /**
   * Converts touch events x and y coordinates into the context of our element center
   *
   * @param x
   * @param y
   * @returns {{x: number, y: number}}
   *
   * @private
   */
  _getOffsetAdjustedPosition(x: number, y: number) {
    const { originalWidth, originalHeight } = this.state;

    const currentElementWidth = originalWidth;
    const currentElementHeight = originalHeight;

    const returnObj = {
      x: (-x + (currentElementWidth / 2)),
      y: (-y + (currentElementHeight / 2)),
    };

    return returnObj;
  }

  /**
   * Zooms to a specific location in our view
   *
   * @param x
   * @param y
   * @param newZoomLevel
   * @param bindToBorders
   *
   * @private
   */
  _zoomToLocation(x: number, y: number, newZoomLevel: number, bindToBorders = true) {
    const offsetAdjustedPosition = this._getOffsetAdjustedPosition(x, y);

    // define the changeObject and make sure the offset values are bound to view
    const changeStateObj = this._bindOffsetValuesToBorders({
      zoomLevel: newZoomLevel,
      offsetX: offsetAdjustedPosition.x,
      offsetY: offsetAdjustedPosition.y,
      lastScale: newZoomLevel,
      lastX: offsetAdjustedPosition.x,
      lastY: offsetAdjustedPosition.y,
    }, bindToBorders);

    this.setState(changeStateObj);
  }

  render() {
    return (
      <View
        style={styles.container}
        {...this.gestureHandlers.panHandlers}
        onLayout={this._getBoxDimensions}
      >
        <View
          style={[styles.wrapper, this.props.style, {
            transform: [
              { scale: this.state.zoomLevel },
              { scale: this.state.zoomLevel },
              { translateX: this.state.offsetX },
              { translateY: this.state.offsetY },
            ],
          }]}
        >
          {this.props.children}
        </View>
      </View>
    );
  }
}

ReactNativeZoomableView.propTypes = {
  ...View.propTypes,
  zoomEnabled: PropTypes.bool,
  initialZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
  doubleTapDelay: PropTypes.number, // how much delay will still be recognized as double press
  bindToBorders: PropTypes.bool, // makes sure that the object stays within box borders
  zoomStep: PropTypes.number, // how much zoom should be applied on double tap
};

ReactNativeZoomableView.defaultProps = {
  zoomEnabled: true,
  initialZoom: 1,
  maxZoom: null,
  minZoom: null,
  doubleTapDelay: 300,
  bindToBorders: true,
  zoomStep: 0.5,
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});

export default ReactNativeZoomableView;
