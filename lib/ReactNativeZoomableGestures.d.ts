import React from 'react';
export declare const swipeDirections: {
    SWIPE_UP: string;
    SWIPE_DOWN: string;
    SWIPE_LEFT: string;
    SWIPE_RIGHT: string;
};
declare class ReactNativeZoomableGestures extends React.Component {
    swipeConfig: {
        velocityThreshold: number;
        directionalOffsetThreshold: number;
        detectSwipeUp: boolean;
        detectSwipeDown: boolean;
        detectSwipeLeft: boolean;
        detectSwipeRight: boolean;
    };
    constructor(props: any, context: any);
    static getDerivedStateFromProps(nextProps: any, prevState: any): void;
    /**
     * Checks the swipe and validates whether we should process it or not
     *
     * @param gestureState
     * @returns {*|boolean}
     *
     * @private
     */
    _validateSwipe(gestureState: any): boolean;
    /**
     * Checks if the gesture is a just click
     *
     * @param gestureState
     * @returns {boolean}
     *
     * @private
     */
    _gestureIsClick(gestureState: any): boolean;
    /**
     * Triggers the swipe action, if we did swipe
     *
     * @param evt
     * @param gestureState
     * @private
     */
    _handlePanResponderEnd(evt: any, gestureState: any): void;
    /**
     * Triggers the correct directional callback
     *
     * @param swipeDirection
     * @param gestureState
     * @private
     */
    _triggerSwipeHandlers(swipeDirection: any, gestureState: any): void;
    /**
     * Calculates what direction the user swiped
     *
     * @param gestureState
     * @returns {*}
     * @private
     */
    _getSwipeDirection(gestureState: any): string;
    /**
     * Checks, whether the swipe was done in a horizontal fashion, respecting velocityThreshold limits
     *
     * @param gestureState
     * @returns {*}
     *
     * @private
     */
    _isValidHorizontalSwipe(gestureState: any): boolean;
    /**
     * Checks, whether the swipe was done in a vertical fashion, respecting velocityThreshold limits
     *
     * @param gestureState
     * @returns {*}
     *
     * @private
     */
    _isValidVerticalSwipe(gestureState: any): boolean;
}
export default ReactNativeZoomableGestures;
