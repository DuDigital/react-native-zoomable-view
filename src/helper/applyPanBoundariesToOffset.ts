/**
 * Takes a single offset value and calculates the correct offset value
 * to make sure it's within the pan boundaries
 *
 *
 * @param offsetScaled
 * @param containerSize
 * @param contentSize
 * @param scale
 *
 * @returns {number}
 */
export function applyPanBoundariesToOffset(
  offsetScaled: number,
  containerSize: number,
  contentSize: number,
  scale: number
) {
  const contentSizeUnscaled = contentSize * scale;
  const offsetUnscaled = offsetScaled * scale;

  const contentStartBorderUnscaled =
    containerSize / 2 + offsetUnscaled - contentSizeUnscaled / 2;
  const contentEndBorderUnscaled =
    contentStartBorderUnscaled + contentSizeUnscaled;

  const containerStartBorder = 0;
  const containerEndBorder = containerStartBorder + containerSize;

  // if content is smaller than the container,
  // don't let content move
  if (contentSizeUnscaled < containerSize) {
    return 0;
  }
  // if content is larger than the container,
  // don't let container go outside of content
  if (contentEndBorderUnscaled < containerEndBorder) {
    return (containerSize / 2 - contentSizeUnscaled / 2) / scale;
  }
  if (contentStartBorderUnscaled > containerStartBorder) {
    return -(containerSize / 2 - contentSizeUnscaled / 2) / scale;
  }

  return offsetScaled;
}
