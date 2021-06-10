"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var initialState = {
    lastZoomLevel: 1,
    offsetX: 0,
    offsetY: 0,
    lastX: 0,
    lastY: 0,
    lastMovePinch: false,
    originalWidth: null,
    originalHeight: null,
};
var ReactNativeZoomableView = /** @class */ (function (_super) {
    __extends(ReactNativeZoomableView, _super);
    function ReactNativeZoomableView(props) {
        var _this = _super.call(this, props) || this;
        _this.contextState = {
            distanceLeft: 0,
            distanceRight: 0,
            distanceTop: 0,
            distanceBottom: 0,
        };
        /**
         * Last press time (used to evaluate whether user double tapped)
         * @type {number}
         */
        _this.longPressTimeout = null;
        /**
         * Current position of zoom center
         * @type { x: number, y: number }
         */
        _this.pinchZoomPosition = null;
        /**
         * Get the original box dimensions and save them for later use.
         * (They will be used to calculate boxBorders)
         *
         * @param layoutEvent
         * @private
         */
        _this._getBoxDimensions = function (layoutEvent) {
            var _a = layoutEvent.nativeEvent.layout, x = _a.x, y = _a.y, height = _a.height, width = _a.width;
            _this.setState({
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
        _this._handleStartShouldSetPanResponder = function (e, gestureState) {
            _this._doubleTapCheck(e, gestureState);
            if (_this.props.onStartShouldSetPanResponder) {
                _this.props.onStartShouldSetPanResponder(e, gestureState, _this._getZoomableViewEventObject(), false);
            }
            return _this.props.captureEvent;
        };
        /**
         * Checks if the movement responder should be triggered
         *
         * @param e
         * @param gestureState
         * @returns {Boolean|boolean}
         */
        _this._handleMoveShouldSetPanResponder = function (e, gestureState) {
            var baseComponentResult = _this.props.zoomEnabled &&
                (Math.abs(gestureState.dx) > 2 ||
                    Math.abs(gestureState.dy) > 2 ||
                    gestureState.numberActiveTouches === 2);
            if (_this.props.onMoveShouldSetPanResponder) {
                baseComponentResult = _this.props.onMoveShouldSetPanResponder(e, gestureState, _this._getZoomableViewEventObject(), baseComponentResult);
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
        _this._handlePanResponderGrant = function (e, gestureState) {
            _this.isDistanceSet = false;
            if (gestureState.numberActiveTouches === 2) {
                var dx = Math.abs(e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX);
                var dy = Math.abs(e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY);
                var distant = Math.sqrt(dx * dx + dy * dy);
                _this.distance = distant;
                _this.isDistanceSet = true;
            }
            if (_this.props.onLongPress) {
                _this.longPressTimeout = setTimeout(function () {
                    if (_this.props.onLongPress) {
                        _this.props.onLongPress(e, gestureState, _this._getZoomableViewEventObject());
                        _this.longPressTimeout = null;
                    }
                }, _this.props.longPressDuration);
            }
            if (_this.props.onPanResponderGrant) {
                _this.props.onPanResponderGrant(e, gestureState, _this._getZoomableViewEventObject());
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
        _this._handlePanResponderEnd = function (e, gestureState) {
            _this.setState({
                lastX: _this.state.offsetX,
                lastY: _this.state.offsetY,
                lastZoomLevel: _this.state.zoomLevel,
            });
            if (_this.longPressTimeout) {
                clearTimeout(_this.longPressTimeout);
                _this.longPressTimeout = null;
            }
            if (_this.props.onPanResponderEnd) {
                _this.props.onPanResponderEnd(e, gestureState, _this._getZoomableViewEventObject());
            }
            if (_this.gestureType === 'pinch') {
                _this.pinchZoomPosition = null;
                if (_this.props.onZoomEnd) {
                    _this.props.onZoomEnd(e, gestureState, _this._getZoomableViewEventObject());
                }
            }
            else if (_this.gestureType === 'shift') {
                if (_this.props.onShiftingEnd) {
                    _this.props.onShiftingEnd(e, gestureState, _this._getZoomableViewEventObject());
                }
            }
            _this.gestureType = null;
        };
        /**
         * Handles the acutal movement of our pan responder
         *
         * @param e
         * @param gestureState
         *
         * @private
         */
        _this._handlePanResponderMove = function (e, gestureState) {
            if (_this.props.onPanResponderMove) {
                if (_this.props.onPanResponderMove(e, gestureState, _this._getZoomableViewEventObject())) {
                    return false;
                }
            }
            if (gestureState.numberActiveTouches === 2) {
                if (_this.longPressTimeout) {
                    clearTimeout(_this.longPressTimeout);
                    _this.longPressTimeout = null;
                }
                if (!_this.isDistanceSet) {
                    _this._handlePanResponderGrant(e, gestureState);
                }
                _this.gestureType = 'pinch';
                _this._handlePinching(e, gestureState);
            }
            else if (gestureState.numberActiveTouches === 1) {
                if (_this.longPressTimeout &&
                    (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5)) {
                    clearTimeout(_this.longPressTimeout);
                    _this.longPressTimeout = null;
                }
                if (_this.gestureType !== 'pinch') {
                    _this.gestureType = 'shift';
                }
                _this._handleMovement(e, gestureState);
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
        _this._handlePinching = function (e, gestureState) {
            var _a = _this.props, maxZoom = _a.maxZoom, minZoom = _a.minZoom, zoomCenteringLevelDistance = _a.zoomCenteringLevelDistance, pinchToZoomInSensitivity = _a.pinchToZoomInSensitivity, pinchToZoomOutSensitivity = _a.pinchToZoomOutSensitivity;
            var dx = Math.abs(e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX);
            var dy = Math.abs(e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY);
            var distant = Math.sqrt(dx * dx + dy * dy);
            if (_this.props.onZoomBefore) {
                if (_this.props.onZoomBefore(e, gestureState, _this._getZoomableViewEventObject())) {
                    return false;
                }
            }
            // define the new zoom level and take zoom level sensitivity into consideration
            var zoomChangeFromStartOfPinch = (distant / _this.distance);
            var pinchToZoomSensitivity = (zoomChangeFromStartOfPinch < 1) ? pinchToZoomOutSensitivity : pinchToZoomInSensitivity;
            var zoomLevel = ((zoomChangeFromStartOfPinch * _this.state.lastZoomLevel) + _this.state.lastZoomLevel * pinchToZoomSensitivity) / (pinchToZoomSensitivity + 1);
            // make sure max and min zoom levels are respected
            if (maxZoom !== null && zoomLevel > maxZoom) {
                zoomLevel = maxZoom;
            }
            if (zoomLevel < minZoom) {
                zoomLevel = minZoom;
            }
            // only use the first position we get by pinching, or the screen will "wobble" during zoom action
            if (_this.pinchZoomPosition === null) {
                var pinchToZoomCenterX = Math.min(e.nativeEvent.touches[0].pageX, e.nativeEvent.touches[1].pageX) + (dx / 2);
                var pinchToZoomCenterY = Math.min(e.nativeEvent.touches[0].pageY, e.nativeEvent.touches[1].pageY) + (dy / 2);
                _this.pinchZoomPosition = _this._getOffsetAdjustedPosition(pinchToZoomCenterX, pinchToZoomCenterY);
            }
            // make sure we shift the layer slowly during our zoom movement
            var zoomStage = Math.abs(zoomLevel - _this.state.lastZoomLevel) / zoomCenteringLevelDistance;
            var ratioOffsetX = _this.state.lastX + zoomStage * _this.pinchZoomPosition.x;
            var ratioOffsetY = _this.state.lastY + zoomStage * _this.pinchZoomPosition.y;
            // define the changeObject and make sure the offset values are bound to view
            var changeStateObj = _this._bindOffsetValuesToBorders({
                zoomLevel: zoomLevel,
                lastMovePinch: true,
                offsetX: ratioOffsetX,
                offsetY: ratioOffsetY,
            }, null);
            _this.setState(changeStateObj, function () {
                if (_this.props.onZoomAfter) {
                    _this.props.onZoomAfter(e, gestureState, _this._getZoomableViewEventObject());
                }
            });
        };
        /**
         * Handles movement by tap and move
         *
         * @param e
         * @param gestureState
         *
         * @private
         */
        _this._handleMovement = function (e, gestureState) {
            var movementSensibility = _this.props.movementSensibility;
            // make sure not to accidentally move after pinch to zoom
            if (_this.pinchZoomPosition) {
                return;
            }
            var offsetX = _this.state.lastX + gestureState.dx / _this.state.zoomLevel / movementSensibility;
            var offsetY = _this.state.lastY + gestureState.dy / _this.state.zoomLevel / movementSensibility;
            _this._setNewOffsetPosition(offsetX, offsetY);
        };
        /**
         * Set the state to offset moved
         *
         * @param {number} newOffsetX
         * @param {number} newOffsetY
         * @param {bool} bindToBorders
         * @param {bool} updateLastCoords should the last coordinates be updated as well?
         * @param {() => void)} callbk
         * @returns
         */
        _this._setNewOffsetPosition = function (newOffsetX, newOffsetY, bindToBorders, updateLastCoords, callbk) {
            if (bindToBorders === void 0) { bindToBorders = true; }
            if (updateLastCoords === void 0) { updateLastCoords = false; }
            if (callbk === void 0) { callbk = null; }
            var _a = _this.props, onShiftingBefore = _a.onShiftingBefore, onShiftingAfter = _a.onShiftingAfter;
            if (onShiftingBefore) {
                if (onShiftingBefore(null, null, _this._getZoomableViewEventObject())) {
                    return false;
                }
            }
            var changeStateObj = _this._bindOffsetValuesToBorders({
                lastMovePinch: false,
                zoomLevel: _this.state.zoomLevel,
                offsetX: newOffsetX,
                offsetY: newOffsetY,
            }, bindToBorders);
            // if we want to update last coords as well -> do that
            if (updateLastCoords) {
                changeStateObj.lastX = changeStateObj.offsetX;
                changeStateObj.lastY = changeStateObj.offsetY;
            }
            _this.setState(changeStateObj, function () {
                if (callbk) {
                    callbk();
                }
                if (onShiftingAfter) {
                    if (onShiftingAfter(null, null, _this._getZoomableViewEventObject())) {
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
        _this._doubleTapCheck = function (e, gestureState) {
            var now = new Date().getTime();
            if (_this.lastPressHolder && (now - _this.lastPressHolder) < _this.props.doubleTapDelay) {
                delete _this.lastPressHolder;
                _this._handleDoubleTap(e, gestureState);
            }
            else {
                _this.lastPressHolder = now;
            }
        };
        _this.gestureHandlers = react_native_1.PanResponder.create({
            onStartShouldSetPanResponder: _this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: _this._handleMoveShouldSetPanResponder,
            onPanResponderGrant: _this._handlePanResponderGrant,
            onPanResponderMove: _this._handlePanResponderMove,
            onPanResponderRelease: _this._handlePanResponderEnd,
            onPanResponderTerminationRequest: function (evt) { return false; },
            onShouldBlockNativeResponder: function (evt) { return false; },
        });
        _this.state = __assign(__assign({}, initialState), { zoomLevel: props.initialZoom, lastZoomLevel: props.initialZoom || initialState.lastZoomLevel, offsetX: props.initialOffsetX, offsetY: props.initialOffsetY });
        _this.distance = 150;
        _this.isDistanceSet = true;
        _this.gestureType = null;
        _this.contextState = {
            distanceLeft: 0,
            distanceRight: 0,
            distanceTop: 0,
            distanceBottom: 0,
        };
        return _this;
    }
    ReactNativeZoomableView.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, zoomEnabled = _a.zoomEnabled, initialZoom = _a.initialZoom;
        if (prevProps.zoomEnabled && !zoomEnabled) {
            this.setState(__assign({ zoomLevel: initialZoom }, initialState));
        }
    };
    /**
     * Returns additional information about components current state for external event hooks
     *
     * @returns {{}}
     * @private
     */
    ReactNativeZoomableView.prototype._getZoomableViewEventObject = function (overwriteObj) {
        if (overwriteObj === void 0) { overwriteObj = {}; }
        return __assign(__assign(__assign({}, this.state), this.contextState), overwriteObj);
    };
    /**
     * Takes a single offset value and calculates the correct offset value within our view to make
     *
     * @param {'x'|'y'} axis
     * @param offsetValue
     * @param containerSize
     * @param elementSize
     * @param zoomLevel
     *
     * @returns {number}
     */
    ReactNativeZoomableView.prototype._getBoundOffsetValue = function (axis, offsetValue, containerSize, elementSize, zoomLevel) {
        var zoomLevelOffsetValue = (zoomLevel * offsetValue);
        var containerToScaledElementRatioSub = 1 - (containerSize / elementSize);
        var halfLengthPlusScaledHalf = 0.5 + (0.5 / zoomLevel);
        var startBorder = containerSize * containerToScaledElementRatioSub * halfLengthPlusScaledHalf;
        var endBorder = (containerSize + startBorder - containerSize) * -1;
        // calculate distance to start and end borders
        var distanceToStart = (offsetValue - startBorder);
        var distanceToEnd = (offsetValue + startBorder) * -1;
        // set context for callback events
        this._setContextStateDistances(axis, distanceToStart, distanceToEnd);
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
    };
    /**
     * Sets the distance to borders for callback events
     *
     * @param axis
     * @param distanceToStart
     * @param distanceToEnd
     * @private
     */
    ReactNativeZoomableView.prototype._setContextStateDistances = function (axis, distanceToStart, distanceToEnd) {
        if (axis === 'x') {
            this.contextState.distanceLeft = distanceToStart;
            this.contextState.distanceRight = distanceToEnd;
            return;
        }
        this.contextState.distanceTop = distanceToStart;
        this.contextState.distanceBottom = distanceToEnd;
    };
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
    ReactNativeZoomableView.prototype._bindOffsetValuesToBorders = function (changeObj, bindToBorders) {
        if (bindToBorders === void 0) { bindToBorders = null; }
        // if bindToBorders is disabled -> nothing do here
        if (bindToBorders === false ||
            (bindToBorders === null && !this.props.bindToBorders)) {
            return changeObj;
        }
        var _a = this.state, originalWidth = _a.originalWidth, originalHeight = _a.originalHeight;
        var currentElementWidth = originalWidth * changeObj.zoomLevel;
        var currentElementHeight = originalHeight * changeObj.zoomLevel;
        // make sure that view doesn't go out of borders
        var offsetXBound = this._getBoundOffsetValue('x', changeObj.offsetX, originalWidth, currentElementWidth, changeObj.zoomLevel);
        changeObj.offsetX = offsetXBound;
        var offsetYBound = this._getBoundOffsetValue('y', changeObj.offsetY, originalHeight, currentElementHeight, changeObj.zoomLevel);
        changeObj.offsetY = offsetYBound;
        return changeObj;
    };
    /**
     * Handles the double tap event
     *
     * @param event
     * @param gestureState
     *
     * @private
     */
    ReactNativeZoomableView.prototype._handleDoubleTap = function (e, gestureState) {
        var _this = this;
        var _a = this.props, onDoubleTapBefore = _a.onDoubleTapBefore, onDoubleTapAfter = _a.onDoubleTapAfter, doubleTapZoomToCenter = _a.doubleTapZoomToCenter;
        // ignore more than 2 touches
        if (gestureState.numberActiveTouches > 1 || !this.props.zoomEnabled) {
            return;
        }
        if (onDoubleTapBefore) {
            onDoubleTapBefore(e, gestureState, this._getZoomableViewEventObject());
        }
        var nextZoomStep = this._getNextZoomStep();
        // define new zoom position coordinates
        var zoomPositionCoordinates = {
            x: e.nativeEvent.locationX,
            y: e.nativeEvent.locationY,
        };
        // if doubleTapZoomToCenter enabled -> always zoom to center instead
        if (doubleTapZoomToCenter) {
            zoomPositionCoordinates.x = 0;
            zoomPositionCoordinates.y = 0;
        }
        this._zoomToLocation(zoomPositionCoordinates.x, zoomPositionCoordinates.y, nextZoomStep, true, function () {
            if (onDoubleTapAfter) {
                onDoubleTapAfter(e, gestureState, _this._getZoomableViewEventObject({
                    zoomLevel: nextZoomStep,
                }));
            }
        });
    };
    /**
     * Returns the next zoom step based on current step and zoomStep property.
     * If we are zoomed all the way in -> return to initialzoom
     *
     * @returns {*}
     */
    ReactNativeZoomableView.prototype._getNextZoomStep = function () {
        var _a = this.props, zoomStep = _a.zoomStep, maxZoom = _a.maxZoom, initialZoom = _a.initialZoom;
        var zoomLevel = this.state.zoomLevel;
        if (zoomLevel === maxZoom) {
            return initialZoom;
        }
        var nextZoomStep = zoomLevel + (zoomLevel * zoomStep);
        if (maxZoom !== null && nextZoomStep > maxZoom) {
            return maxZoom;
        }
        return nextZoomStep;
    };
    /**
     * Converts touch events x and y coordinates into the context of our element center
     *
     * @param x
     * @param y
     * @returns {{x: number, y: number}}
     *
     * @private
     */
    ReactNativeZoomableView.prototype._getOffsetAdjustedPosition = function (x, y) {
        var _a = this.state, originalWidth = _a.originalWidth, originalHeight = _a.originalHeight;
        if (x === 0 && y === 0) {
            return {
                x: 0,
                y: 0,
            };
        }
        var returnObj = {
            x: (-x + (originalWidth / 2)),
            y: (-y + (originalHeight / 2)),
        };
        return returnObj;
    };
    /**
     * Zooms to a specific location in our view
     *
     * @param x
     * @param y
     * @param newZoomLevel
     * @param bindToBorders
     * @param callbk
     *
     * @private
     */
    ReactNativeZoomableView.prototype._zoomToLocation = function (x, y, newZoomLevel, bindToBorders, callbk) {
        if (bindToBorders === void 0) { bindToBorders = true; }
        if (callbk === void 0) { callbk = null; }
        var offsetAdjustedPosition = this._getOffsetAdjustedPosition(x, y);
        // define the changeObject and make sure the offset values are bound to view
        var changeStateObj = this._bindOffsetValuesToBorders({
            zoomLevel: newZoomLevel,
            offsetX: offsetAdjustedPosition.x,
            offsetY: offsetAdjustedPosition.y,
            lastZoomLevel: newZoomLevel,
            lastX: offsetAdjustedPosition.x,
            lastY: offsetAdjustedPosition.y,
        }, bindToBorders);
        this.setState(changeStateObj, function () {
            if (callbk) {
                callbk();
            }
        });
    };
    /**
     * Zooms to a specificied zoom level.
     * Returns a promise if everything was updated and a boolean, whether it could be updated or if it exceeded the min/max zoom limits.
     *
     * @param {number} newZoomLevel
     * @param {bool} bindToBorders
     *
     * @return {Promise<bool>}
     */
    ReactNativeZoomableView.prototype.zoomTo = function (newZoomLevel, bindToBorders) {
        var _this = this;
        if (bindToBorders === void 0) { bindToBorders = true; }
        return new Promise(function (resolve) {
            // if we would go out of our min/max limits -> abort
            if (newZoomLevel >= _this.props.maxZoom
                || newZoomLevel <= _this.props.minZoom) {
                resolve(false);
                return;
            }
            _this._zoomToLocation(0, 0, newZoomLevel, bindToBorders, function () {
                resolve(true);
            });
        });
    };
    /**
     * Zooms in or out by a specificied change level
     * Use a positive number for `zoomLevelChange` to zoom in
     * Use a negative number for `zoomLevelChange` to zoom out
     *
     * Returns a promise if everything was updated and a boolean, whether it could be updated or if it exceeded the min/max zoom limits.
     *
     * @param {number} newZoomLevel
     * @param {bool} bindToBorders
     *
     * @return {Promise<bool>}
     */
    ReactNativeZoomableView.prototype.zoomBy = function (zoomLevelChange, bindToBorders) {
        if (zoomLevelChange === void 0) { zoomLevelChange = null; }
        if (bindToBorders === void 0) { bindToBorders = true; }
        // if no zoom level Change given -> just use zoom step
        if (!zoomLevelChange) {
            zoomLevelChange = this.props.zoomStep;
        }
        return this.zoomTo(this.state.zoomLevel + zoomLevelChange, bindToBorders);
    };
    /**
     * Moves the zoomed view to a specified position
     * Returns a promise when finished
     *
     * @param {number} newOffsetX the new position we want to move it to (x-axis)
     * @param {number} newOffsetY the new position we want to move it to (y-axis)
     * @param {bool} bindToBorders
     *
     * @return {Promise<bool>}
     */
    ReactNativeZoomableView.prototype.moveTo = function (newOffsetX, newOffsetY, bindToBorders) {
        var _this = this;
        if (bindToBorders === void 0) { bindToBorders = true; }
        var _a = this.state, zoomLevel = _a.zoomLevel, originalWidth = _a.originalWidth, originalHeight = _a.originalHeight;
        var offsetX = (newOffsetX - (originalWidth / 2)) / zoomLevel;
        var offsetY = (newOffsetY - (originalHeight / 2)) / zoomLevel;
        return new Promise(function (resolve) {
            _this._setNewOffsetPosition(-offsetX, -offsetY, bindToBorders, true, function () {
                resolve();
            });
        });
    };
    /**
     * Moves the zoomed view by a certain amount.
     *
     * Returns a promise when finished
     *
     * @param {number} offsetChangeX the amount we want to move the offset by (x-axis)
     * @param {number} offsetChangeXY the amount we want to move the offset by (y-axis)
     * @param {bool} bindToBorders
     *
     * @return {Promise<bool>}
     */
    ReactNativeZoomableView.prototype.moveBy = function (offsetChangeX, offsetChangeY, bindToBorders) {
        var _this = this;
        if (bindToBorders === void 0) { bindToBorders = true; }
        var _a = this.state, zoomLevel = _a.zoomLevel, lastX = _a.lastX, lastY = _a.lastY;
        var offsetX = lastX - offsetChangeX / zoomLevel;
        var offsetY = lastY - offsetChangeY / zoomLevel;
        return new Promise(function (resolve) {
            _this._setNewOffsetPosition(offsetX, offsetY, bindToBorders, true, function () {
                resolve();
            });
        });
    };
    ReactNativeZoomableView.prototype.render = function () {
        return (react_1.default.createElement(react_native_1.View, __assign({ style: styles.container }, this.gestureHandlers.panHandlers, { onLayout: this._getBoxDimensions }),
            react_1.default.createElement(react_native_1.View, { style: [styles.wrapper, this.props.style, {
                        transform: [
                            { scale: this.state.zoomLevel },
                            { scale: this.state.zoomLevel },
                            { translateX: this.state.offsetX },
                            { translateY: this.state.offsetY },
                        ],
                    }] }, this.props.children)));
    };
    return ReactNativeZoomableView;
}(react_1.Component));
/*
TODO: delete them if not needed anymore

ReactNativeZoomableView.propTypes = {
    ...View.propTypes,
    zoomEnabled: PropTypes.bool,
    initialZoom: PropTypes.number,
    initialOffsetX: PropTypes.number,
    initialOffsetY: PropTypes.number,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    pinchToZoomInSensitivity: PropTypes.number, // the level of resistance (sensitivity) to zoom in (0 - 10) - higher is less sensitive - default: 3
    pinchToZoomOutSensitivity: PropTypes.number, // the level of resistance (sensitivity) to zoom out (0 - 10) - higher is less sensitive default: 1
    zoomCenteringLevelDistance: PropTypes.number, // the (zoom level - 0 - maxZoom) distance for pinch to zoom actions until they are shifted on new pinch to zoom center - higher means it centeres slower - default 0.5
    movementSensibility: PropTypes.number, // how resistant should shifting the view around be? (0.5 - 5) - higher is less sensitive - default: 1.9
    doubleTapDelay: PropTypes.number, // how much delay will still be recognized as double press
    bindToBorders: PropTypes.bool, // makes sure that the object stays within box borders
    zoomStep: PropTypes.number, // how much zoom should be applied on double tap
    onZoomBefore: PropTypes.func, // triggered before pinch movement
    onZoomAfter: PropTypes.func, // triggered after pinch movement
    onZoomEnd: PropTypes.func, // triggered after pinch movement ended
    onDoubleTapBefore: PropTypes.func,
    onDoubleTapAfter: PropTypes.func,
    onShiftingBefore: PropTypes.func, // triggered before shift movement
    onShiftingAfter: PropTypes.func, // triggered after shift movement
    onShiftingEnd: PropTypes.func, // triggered after shift movement ended
    onStartShouldSetPanResponder: PropTypes.func,
    onMoveShouldSetPanResponder: PropTypes.func,
    onPanResponderGrant: PropTypes.func,
    onPanResponderEnd: PropTypes.func,
    onPanResponderMove: PropTypes.func,
    onLongPress: PropTypes.func,
    longPressDuration: PropTypes.number
};

ReactNativeZoomableView.defaultProps = {
    zoomEnabled: true,
    initialZoom: 1,
    initialOffsetX: 0,
    initialOffsetY: 0,
    maxZoom: 1.5,
    minZoom: 0.5,
    pinchToZoomInSensitivity: 3,
    pinchToZoomOutSensitivity: 1,
    zoomCenteringLevelDistance: 0.5,
    movementSensibility: 1.9,
    doubleTapDelay: 300,
    bindToBorders: true,
    zoomStep: 0.5,
    onLongPress: null,
    longPressDuration: 700,
    captureEvent: false,
}; */
var styles = react_native_1.StyleSheet.create({
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
exports.default = ReactNativeZoomableView;
