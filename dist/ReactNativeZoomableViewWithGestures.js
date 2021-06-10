var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import ReactNativeZoomableView from './ReactNativeZoomableView';
export var swipeDirections = {
    SWIPE_UP: 'SWIPE_UP',
    SWIPE_DOWN: 'SWIPE_DOWN',
    SWIPE_LEFT: 'SWIPE_LEFT',
    SWIPE_RIGHT: 'SWIPE_RIGHT',
};
var ReactNativeZoomableViewWithGestures = /** @class */ (function (_super) {
    __extends(ReactNativeZoomableViewWithGestures, _super);
    function ReactNativeZoomableViewWithGestures() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onShiftingEnd = function (e, gestureState, zoomableViewState) {
            if (_this.props.onShiftingEnd) {
                _this.props.onShiftingEnd(e, gestureState, zoomableViewState);
            }
            if (!_this._couldCallSwipeEvent(zoomableViewState)) {
                return;
            }
            var swipeDirection = _this._getSwipeDirection(gestureState);
            _this._triggerSwipeHandlers(swipeDirection, gestureState);
        };
        return _this;
    }
    /**
     * Checks if current config options make it possible to process a swipe or if is not necessary
     *
     * @returns {*}
     * @private
     */
    ReactNativeZoomableViewWithGestures.prototype._couldCallSwipeEvent = function (zoomableViewState) {
        var _a = this.props, onSwipe = _a.onSwipe, onSwipeUp = _a.onSwipeUp, onSwipeDown = _a.onSwipeDown, onSwipeLeft = _a.onSwipeLeft, onSwipeRight = _a.onSwipeRight, swipeMaxZoom = _a.swipeMaxZoom, swipeMinZoom = _a.swipeMinZoom;
        if (swipeMaxZoom && zoomableViewState.zoomLevel > swipeMaxZoom) {
            return false;
        }
        if (swipeMinZoom && zoomableViewState.zoomLevel < swipeMinZoom) {
            return false;
        }
        return onSwipe && onSwipeUp && onSwipeDown && onSwipeLeft && onSwipeRight;
    };
    /**
     * Checks the swipe and validates whether we should process it or not
     *
     * @param gestureState
     * @returns {*|boolean}
     *
     * @private
     */
    ReactNativeZoomableViewWithGestures.prototype._validateSwipe = function (gestureState) {
        var _a = this.props, onSwipeUp = _a.onSwipeUp, onSwipeDown = _a.onSwipeDown, onSwipeLeft = _a.onSwipeLeft, onSwipeRight = _a.onSwipeRight;
        var swipeDirection = this._getSwipeDirection(gestureState);
        var SWIPE_LEFT = swipeDirections.SWIPE_LEFT, SWIPE_RIGHT = swipeDirections.SWIPE_RIGHT, SWIPE_UP = swipeDirections.SWIPE_UP, SWIPE_DOWN = swipeDirections.SWIPE_DOWN;
        return ((onSwipeUp && swipeDirection === SWIPE_UP) ||
            (onSwipeDown && swipeDirection === SWIPE_DOWN) ||
            (onSwipeLeft && swipeDirection === SWIPE_LEFT) ||
            (onSwipeRight && swipeDirection === SWIPE_RIGHT));
    };
    /**
     * Triggers the correct directional callback
     *
     * @param swipeDirection
     * @param gestureState
     * @private
     */
    ReactNativeZoomableViewWithGestures.prototype._triggerSwipeHandlers = function (swipeDirection, gestureState) {
        var _a = this.props, onSwipe = _a.onSwipe, onSwipeUp = _a.onSwipeUp, onSwipeDown = _a.onSwipeDown, onSwipeLeft = _a.onSwipeLeft, onSwipeRight = _a.onSwipeRight;
        var SWIPE_LEFT = swipeDirections.SWIPE_LEFT, SWIPE_RIGHT = swipeDirections.SWIPE_RIGHT, SWIPE_UP = swipeDirections.SWIPE_UP, SWIPE_DOWN = swipeDirections.SWIPE_DOWN;
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
    };
    /**
     * Calculates what direction the user swiped
     *
     * @param gestureState
     * @returns {*}
     * @private
     */
    ReactNativeZoomableViewWithGestures.prototype._getSwipeDirection = function (gestureState) {
        var swipeLengthThreshold = this.props.swipeLengthThreshold;
        var SWIPE_LEFT = swipeDirections.SWIPE_LEFT, SWIPE_RIGHT = swipeDirections.SWIPE_RIGHT, SWIPE_UP = swipeDirections.SWIPE_UP, SWIPE_DOWN = swipeDirections.SWIPE_DOWN;
        var dx = gestureState.dx, dy = gestureState.dy;
        if (!swipeLengthThreshold) {
            return;
        }
        if (this._isValidHorizontalSwipe(gestureState)) {
            if (Math.abs(dx) > swipeLengthThreshold) {
                return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
            }
        }
        else if (this._isValidVerticalSwipe(gestureState)) {
            if (Math.abs(dy) > swipeLengthThreshold) {
                return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
            }
        }
        return null;
    };
    /**
     * Checks, whether the swipe was done in a horizontal fashion, respecting swipeVelocityThreshold limits
     *
     * @param gestureState
     * @returns {*}
     *
     * @private
     */
    ReactNativeZoomableViewWithGestures.prototype._isValidHorizontalSwipe = function (gestureState) {
        var vx = gestureState.vx, dy = gestureState.dy;
        var _a = this.props, swipeVelocityThreshold = _a.swipeVelocityThreshold, swipeDirectionalThreshold = _a.swipeDirectionalThreshold;
        return this._isValidSwipe(vx, swipeVelocityThreshold, dy, swipeDirectionalThreshold);
    };
    /**
     * Checks, whether the swipe was done in a vertical fashion, respecting swipeVelocityThreshold limits
     *
     * @param gestureState
     * @returns {*}
     *
     * @private
     */
    ReactNativeZoomableViewWithGestures.prototype._isValidVerticalSwipe = function (gestureState) {
        var vy = gestureState.vy, dx = gestureState.dx;
        var _a = this.props, swipeVelocityThreshold = _a.swipeVelocityThreshold, swipeDirectionalThreshold = _a.swipeDirectionalThreshold;
        return this._isValidSwipe(vy, swipeVelocityThreshold, dx, swipeDirectionalThreshold);
    };
    /**
     * Checks the sipw against velocity and directional offset to make sure it only gets activated, when we actually need it
     *
     * @param velocity
     * @param swipeVelocityThreshold
     * @param directionalOffset
     * @param swipeDirectionalThreshold
     *
     * @returns {boolean}
     *
     * @private
     */
    ReactNativeZoomableViewWithGestures.prototype._isValidSwipe = function (velocity, swipeVelocityThreshold, directionalOffset, swipeDirectionalThreshold) {
        return Math.abs(velocity) > swipeVelocityThreshold && Math.abs(directionalOffset) < swipeDirectionalThreshold;
    };
    ReactNativeZoomableViewWithGestures.prototype.render = function () {
        return React.createElement(ReactNativeZoomableView, __assign({}, this.props, { onShiftingEnd: this._onShiftingEnd }));
    };
    return ReactNativeZoomableViewWithGestures;
}(React.Component));
/*
TODO: Remove this when typescript is proven to work
ReactNativeZoomableViewWithGestures.propTypes = {
  swipeLengthThreshold: PropTypes.number,
  swipeVelocityThreshold: PropTypes.number,
  swipeDirectionalThreshold: PropTypes.number,
  swipeMinZoom: PropTypes.number,
  swipeMaxZoom: PropTypes.number,
  swipeDisabled: PropTypes.bool,
  onSwipe: PropTypes.func,
  onSwipeUp: PropTypes.func,
  onSwipeDown: PropTypes.func,
  onSwipeLeft: PropTypes.func,
  onSwipeRight: PropTypes.func,
};

ReactNativeZoomableViewWithGestures.defaultProps = {
  swipeLengthThreshold: 0,
  swipeVelocityThreshold: 0.1,
  swipeDirectionalThreshold: 120,
  swipeMinZoom: null,
  swipeMaxZoom: null,
  swipeDisabled: false,
  onSwipe: null,
  onSwipeUp: null,
  onSwipeDown: null,
  onSwipeLeft: null,
  onSwipeRight: null,
};
 */
export default ReactNativeZoomableViewWithGestures;
//# sourceMappingURL=ReactNativeZoomableViewWithGestures.js.map