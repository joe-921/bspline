import React, { useState, useRef } from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
// import Svg, { Path } from 'react-native-svg';
import DrawTextAnimation from './components/DrawTextAnimation';

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

// function bSpline(points, degree, t) {
//   if (degree === 0) {
//     return points[Math.round(t * (points.length - 1))];
//   }
//   const newPoints = [];
//   for (let i = 0; i < points.length - 1; i++) {
//     newPoints.push({
//       x: (1 - t) * points[i].x + t * points[i + 1].x,
//       y: (1 - t) * points[i].y + t * points[i + 1].y,
//     });
//   }
//   return bSpline(newPoints, degree - 1, t);
// }

export default function App() {
  // const [points, setPoints] = useState([]);
  // const [path, setPath] = useState('');
  // const [color, setColor] = useState('black');
  // const [paths, setPaths] = useState([]);

  // const handleTouchStart = (event) => {
  //   const { locationX, locationY } = event.nativeEvent;
  //   let x = locationX;
  //   let y = locationY;
  //   if (locationX <= screenWidth * 0.1) {
  //     setPoints([{ x: -screenWidth, y: locationY }, { x, y }]);
  //   } else if (locationX >= screenWidth * 0.9) {
  //     setPoints([{ x: screenWidth * 2, y: locationY }, { x, y }]);
  //   } else {
  //     setPoints([{ x, y }]);
  //   }
  //   const hue = Math.floor(Math.random() * 360);
  //   const lightness = 75 + Math.floor(Math.random() * 25);
  //   setColor(`hsl(${hue}, 100%, ${lightness}%)`);
  // };


  // const handleTouchMove = (event) => {
  //   const { locationX, locationY } = event.nativeEvent;
  //   let x = locationX;
  //   let y = locationY;
  //   if (locationX <= screenWidth * 0.1) {
  //     x = -screenWidth;
  //   } else if (locationX >= screenWidth * 0.9) {
  //     x = screenWidth * 2;
  //   }
  //   setPoints((points) => [...points, { x, y }]);
  //   let pathString = '';
  //   for (let i = 0; i <= 1; i += 0.01) {
  //     const point = bSpline(points, Math.min(100, points.length - 1), i);
  //     if (i === 0) {
  //       pathString += `M ${point.x} ${point.y}`;
  //     } else {
  //       pathString += ` L ${point.x} ${point.y}`;
  //     }
  //   }
  //   setPath(pathString);
  // };

  // const handleTouchEnd = () => {
  //   if (points.length > 0) {
  //     setPaths((paths) => [...paths, { path, color }]);
  //     setPoints([]);
  //     setPath('');
  //   }
  // };

  // const handleTap = () => {
  //   if (points.length === 0 && paths.length > 0) {
  //     const hue = Math.floor(Math.random() * 360);
  //     const lightness = 75 + Math.floor(Math.random() * 25);
  //     const newColor = `hsl(${hue},100%,${lightness}%)`;
  //     setPaths((paths) =>
  //       paths.map((pathObj, index) =>
  //         index === paths.length - 1 ? { ...pathObj, color: newColor } : pathObj
  //       )
  //     );
  //   }
  // };

  return (
    // <View
    //   style={styles.container}
    //   onTouchStart={handleTouchStart}
    //   onTouchMove={handleTouchMove}
    //   onTouchEnd={handleTouchEnd}
    //   onStartShouldSetResponder={() => true}
    //   onResponderRelease={handleTap}
    // >
    //   <Svg style={styles.svg}>
    //     {paths.map((pathObj, index) => (
    //       <Path
    //         key={index}
    //         d={pathObj.path}
    //         stroke={pathObj.color}
    //         strokeWidth={30}
    //         fill="none"
    //       />
    //     ))}
    //     <Path d={path} stroke={color} strokeWidth={30} fill="none" />
    //   </Svg>
    // </View>
    <DrawTextAnimation />
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   svg: {
//     flex: 1,
//   },
// });