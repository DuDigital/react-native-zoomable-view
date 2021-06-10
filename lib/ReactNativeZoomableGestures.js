'use strict';
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swipeDirections = void 0;
var react_1 = __importDefault(require("react"));
var ReactNativeZoomableView_1 = __importDefault(require("./ReactNativeZoomableView"));
exports.swipeDirections = {
    SWIPE_UP: 'SWIPE_UP',
    SWIPE_DOWN: 'SWIPE_DOWN',
    SWIPE_LEFT: 'SWIPE_LEFT',
    SWIPE_RIGHT: 'SWIPE_RIGHT',
};
var swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
    detectSwipeUp: true,
    detectSwipeDown: true,
    detectSwipeLeft: true,
    detectSwipeRight: true,
};
function isValidSwipe(velocity, velocityThreshold, directionalOffset, directionalOffsetThreshold) {
    return Math.abs(velocity) > velocityThreshold && Math.abs(directionalOffset) < directionalOffsetThreshold;
}
var ReactNativeZoomableGestures = /** @class */ (function (_super) {
    __extends(ReactNativeZoomableGestures, _super);
    function ReactNativeZoomableGestures(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.swipeConfig = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80,
            detectSwipeUp: true,
            detectSwipeDown: true,
            detectSwipeLeft: true,
            detectSwipeRight: true,
        };
        _this.swipeConfig = Object.assign(swipeConfig, props.config);
        var parent = ReactNativeZoomableView_1.default.prototype.parentHandleMoveShouldSetPanResponder.call(_this);
        return _this;
    }
    ReactNativeZoomableGestures.getDerivedStateFromProps = function (nextProps, prevState) {
        if (nextProps !== prevState) {
            this.swipeConfig = Object.assign(swipeConfig, nextProps.config);
        }
    };
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
    ReactNativeZoomableGestures.prototype._validateSwipe = function (gestureState) {
        var _a = this.swipeConfig, detectSwipeUp = _a.detectSwipeUp, detectSwipeDown = _a.detectSwipeDown, detectSwipeLeft = _a.detectSwipeLeft, detectSwipeRight = _a.detectSwipeRight;
        var swipeDirection = this._getSwipeDirection(gestureState);
        var SWIPE_LEFT = exports.swipeDirections.SWIPE_LEFT, SWIPE_RIGHT = exports.swipeDirections.SWIPE_RIGHT, SWIPE_UP = exports.swipeDirections.SWIPE_UP, SWIPE_DOWN = exports.swipeDirections.SWIPE_DOWN;
        return ((detectSwipeUp && swipeDirection === SWIPE_UP) ||
            (detectSwipeDown && swipeDirection === SWIPE_DOWN) ||
            (detectSwipeLeft && swipeDirection === SWIPE_LEFT) ||
            (detectSwipeRight && swipeDirection === SWIPE_RIGHT));
    };
    /**
     * Checks if the gesture is a just click
     *
     * @param gestureState
     * @returns {boolean}
     *
     * @private
     */
    ReactNativeZoomableGestures.prototype._gestureIsClick = function (gestureState) {
        return Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;
    };
    /**
     * Triggers the swipe action, if we did swipe
     *
     * @param evt
     * @param gestureState
     * @private
     */
    ReactNativeZoomableGestures.prototype._handlePanResponderEnd = function (evt, gestureState) {
        var swipeDirection = this._getSwipeDirection(gestureState);
        this._triggerSwipeHandlers(swipeDirection, gestureState);
        _super.prototype._handlePanResponderEnd.call(this, evt, gestureState);
    };
    /**
     * Triggers the correct directional callback
     *
     * @param swipeDirection
     * @param gestureState
     * @private
     */
    ReactNativeZoomableGestures.prototype._triggerSwipeHandlers = function (swipeDirection, gestureState) {
        var _a = this.props, onSwipe = _a.onSwipe, onSwipeUp = _a.onSwipeUp, onSwipeDown = _a.onSwipeDown, onSwipeLeft = _a.onSwipeLeft, onSwipeRight = _a.onSwipeRight;
        var SWIPE_LEFT = exports.swipeDirections.SWIPE_LEFT, SWIPE_RIGHT = exports.swipeDirections.SWIPE_RIGHT, SWIPE_UP = exports.swipeDirections.SWIPE_UP, SWIPE_DOWN = exports.swipeDirections.SWIPE_DOWN;
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
    ReactNativeZoomableGestures.prototype._getSwipeDirection = function (gestureState) {
        var SWIPE_LEFT = exports.swipeDirections.SWIPE_LEFT, SWIPE_RIGHT = exports.swipeDirections.SWIPE_RIGHT, SWIPE_UP = exports.swipeDirections.SWIPE_UP, SWIPE_DOWN = exports.swipeDirections.SWIPE_DOWN;
        var dx = gestureState.dx, dy = gestureState.dy;
        if (this._isValidHorizontalSwipe(gestureState)) {
            return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
        }
        else if (this._isValidVerticalSwipe(gestureState)) {
            return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
        }
        return null;
    };
    /**
     * Checks, whether the swipe was done in a horizontal fashion, respecting velocityThreshold limits
     *
     * @param gestureState
     * @returns {*}
     *
     * @private
     */
    ReactNativeZoomableGestures.prototype._isValidHorizontalSwipe = function (gestureState) {
        var vx = gestureState.vx, dy = gestureState.dy;
        var _a = this.swipeConfig, velocityThreshold = _a.velocityThreshold, directionalOffsetThreshold = _a.directionalOffsetThreshold;
        return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
    };
    /**
     * Checks, whether the swipe was done in a vertical fashion, respecting velocityThreshold limits
     *
     * @param gestureState
     * @returns {*}
     *
     * @private
     */
    ReactNativeZoomableGestures.prototype._isValidVerticalSwipe = function (gestureState) {
        var vy = gestureState.vy, dx = gestureState.dx;
        var _a = this.swipeConfig, velocityThreshold = _a.velocityThreshold, directionalOffsetThreshold = _a.directionalOffsetThreshold;
        return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
    };
    return ReactNativeZoomableGestures;
}(react_1.default.Component));
exports.default = ReactNativeZoomableGestures;
