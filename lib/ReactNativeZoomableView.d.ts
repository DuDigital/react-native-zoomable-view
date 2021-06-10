import { ReactNativeZoomableViewProps, ReactNativeZoomableViewState, ZoomableViewEvent } from '@dudigital/react-native-zoomable-view';
import { Component } from 'react';
declare class ReactNativeZoomableView extends Component<ReactNativeZoomableViewProps, ReactNativeZoomableViewState> {
    gestureHandlers: any;
    distance: number;
    isDistanceSet: boolean;
    lastPressHolder: number;
    gestureType: 'pinch' | 'shift' | 'null';
    contextState: {
        distanceLeft: number;
        distanceRight: number;
        distanceTop: number;
        distanceBottom: number;
    };
    constructor(props: any);
    componentDidUpdate(prevProps: any): void;
    /**
     * Last press time (used to evaluate whether user double tapped)
     * @type {number}
     */
    longPressTimeout: any;
    /**
     * Current position of zoom center
     * @type { x: number, y: number }
     */
    pinchZoomPosition: any;
    /**
     * Returns additional information about components current state for external event hooks
     *
     * @returns {{}}
     * @private
     */
    _getZoomableViewEventObject(overwriteObj?: {}): ZoomableViewEvent;
    /**
     * Get the original box dimensions and save them for later use.
     * (They will be used to calculate boxBorders)
     *
     * @param layoutEvent
     * @private
     */
    _getBoxDimensions: (layoutEvent: any) => void;
    /**
     * Handles the start of touch events and checks for taps
     *
     * @param e
     * @param gestureState
     * @returns {boolean}
     *
     * @private
     */
    _handleStartShouldSetPanResponder: (e: any, gestureState: any) => boolean;
    /**
     * Checks if the movement responder should be triggered
     *
     * @param e
     * @param gestureState
     * @returns {Boolean|boolean}
     */
    _handleMoveShouldSetPanResponder: (e: any, gestureState: any) => boolean;
    /**
     * Calculates pinch distance
     *
     * @param e
     * @param gestureState
     * @private
     */
    _handlePanResponderGrant: (e: any, gestureState: any) => void;
    /**
     * Handles the end of touch events
     *
     * @param e
     * @param gestureState
     *
     * @private
     */
    _handlePanResponderEnd: (e: any, gestureState: any) => void;
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
    _getBoundOffsetValue(axis: 'x' | 'y', offsetValue: number, containerSize: number, elementSize: number, zoomLevel: number): number;
    /**
     * Sets the distance to borders for callback events
     *
     * @param axis
     * @param distanceToStart
     * @param distanceToEnd
     * @private
     */
    _setContextStateDistances(axis: 'x' | 'y', distanceToStart: number, distanceToEnd: number): void;
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
    _bindOffsetValuesToBorders(changeObj: any, bindToBorders?: any): any;
    /**
     * Handles the acutal movement of our pan responder
     *
     * @param e
     * @param gestureState
     *
     * @private
     */
    _handlePanResponderMove: (e: any, gestureState: any) => boolean;
    /**
     * Handles the pinch movement and zooming
     *
     * @param e
     * @param gestureState
     *
     * @private
     */
    _handlePinching: (e: any, gestureState: any) => boolean;
    /**
     * Handles movement by tap and move
     *
     * @param e
     * @param gestureState
     *
     * @private
     */
    _handleMovement: (e: any, gestureState: any) => void;
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
    _setNewOffsetPosition: (newOffsetX: number, newOffsetY: number, bindToBorders?: boolean, updateLastCoords?: boolean, callbk?: any) => boolean;
    /**
     * Wraps the check for double tap
     *
     * @param e
     * @param gestureState
     *
     * @private
     */
    _doubleTapCheck: (e: any, gestureState: any) => void;
    /**
     * Handles the double tap event
     *
     * @param event
     * @param gestureState
     *
     * @private
     */
    _handleDoubleTap(e: any, gestureState: any): void;
    /**
     * Returns the next zoom step based on current step and zoomStep property.
     * If we are zoomed all the way in -> return to initialzoom
     *
     * @returns {*}
     */
    _getNextZoomStep(): number;
    /**
     * Converts touch events x and y coordinates into the context of our element center
     *
     * @param x
     * @param y
     * @returns {{x: number, y: number}}
     *
     * @private
     */
    _getOffsetAdjustedPosition(x: number, y: number): {
        x: number;
        y: number;
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
    _zoomToLocation(x: number, y: number, newZoomLevel: number, bindToBorders?: boolean, callbk?: any): void;
    /**
     * Zooms to a specificied zoom level.
     * Returns a promise if everything was updated and a boolean, whether it could be updated or if it exceeded the min/max zoom limits.
     *
     * @param {number} newZoomLevel
     * @param {bool} bindToBorders
     *
     * @return {Promise<bool>}
     */
    zoomTo(newZoomLevel: number, bindToBorders?: boolean): Promise<boolean>;
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
    zoomBy(zoomLevelChange?: number, bindToBorders?: boolean): Promise<boolean>;
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
    moveTo(newOffsetX: number, newOffsetY: number, bindToBorders?: boolean): Promise<void>;
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
    moveBy(offsetChangeX: number, offsetChangeY: number, bindToBorders?: boolean): Promise<void>;
    render(): JSX.Element;
}
export default ReactNativeZoomableView;
