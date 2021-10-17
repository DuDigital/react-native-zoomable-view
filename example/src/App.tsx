import * as React from 'react';

import { StyleSheet, View, Text, Image, Animated, Button } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

export default function App() {
  const zoomAnimatedValue = new Animated.Value(1);
  const scale = Animated.divide(1, zoomAnimatedValue);
  const [showMarkers, setShowMarkers] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text>ReactNativeZoomableView</Text>
      <View style={styles.box}>
        <ReactNativeZoomableView
          maxZoom={30}
          initialZoom={1.5}
          // Give these to the zoomable view so it can apply the boundaries around the actual content.
          // Need to make sure the content is actually centered and the width and height are
          // measured when it's rendered naturally. Not the intrinsic sizes.
          // For example, an image with an intrinsic size of 400x200 will be rendered as 300x150 in this case.
          // Therefore, we'll feed the zoomable view the 300x100 size.
          contentWidth={400}
          contentHeight={800}
          zoomAnimatedValue={zoomAnimatedValue}
        >
          <View style={styles.contents}>
            <Image
              style={styles.img}
              source={{ uri: 'https://placekitten.com/400/800' }}
            />

            {showMarkers &&
              [20, 40, 60, 80].map((left) =>
                [20, 40, 60, 80].map((top) => (
                  <Animated.View
                    key={`${left}x${top}`}
                    // These markers will move and zoom with the image, but will retain their size
                    // becuase of the scale transformation.
                    style={[
                      styles.marker,
                      { left: `${left}%`, top: `${top}%` },
                      { transform: [{ scale }] },
                    ]}
                  />
                ))
              )}
          </View>
        </ReactNativeZoomableView>
      </View>
      <Button
        title={`${showMarkers ? 'Hide' : 'Show'} markers`}
        onPress={() => setShowMarkers((value) => !value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  contents: { width: 200, height: 400 },
  box: { borderWidth: 5, flexShrink: 1, height: 500, width: 310 },
  img: { width: '100%', height: '100%', resizeMode: 'contain' },
  marker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    marginLeft: -10,
    marginTop: -10,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 2,
  },
});
