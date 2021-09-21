import { View } from 'react-native';
import React from 'react';

export const DebugTouchPoint = ({
  diameter = 20,
  x = 0,
  y = 0,
  color = 'yellow',
}) => {
  const radius = diameter / 2;
  return (
    <View
      style={{
        width: diameter,
        height: diameter,
        borderRadius: diameter,
        backgroundColor: color,
        position: 'absolute',
        left: x - radius,
        top: y - radius,
        opacity: 0.7,
      }}
      pointerEvents="none"
    />
  );
};
export const DebugRect = ({
  height,
  x = 0,
  y = 0,
  color = 'yellow',
}: {
  height: number;
  x: number;
  y: number;
  color: string;
}) => {
  const width = 5;
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: color,
        position: 'absolute',
        left: x - width / 2,
        top: y,
        opacity: 0.5,
      }}
      pointerEvents="none"
    />
  );
};
