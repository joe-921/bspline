import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TextInput } from 'react-native';
import Svg, { G, Path, Text as SVGText, TextPath } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function bSpline(points, degree, t) {
  if (degree === 0) {
    return points[Math.round(t * (points.length - 1))];
  }
  const newPoints = [];
  for (let i = 0; i < points.length - 1; i++) {
    newPoints.push({
      x: (1 - t) * points[i].x + t * points[i + 1].x,
      y: (1 - t) * points[i].y + t * points[i + 1].y,
    });
  }
  return bSpline(newPoints, degree - 1, t);
}

export default function App() {
  const [points, setPoints] = useState([]);
  const [path, setPath] = useState('');
  const [color, setColor] = useState('black');
  const [paths, setPaths] = useState([]);
  const [tempText, setTempText] = useState('');
  const [typeable, setTypeable] = useState(false);

  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    let x = locationX;
    let y = locationY;
    if (locationX <= screenWidth * 0.1) {
      setPoints([{ x: -screenWidth, y: locationY }, { x, y }]);
    } else if (locationX >= screenWidth * 0.9) {
      setPoints([{ x: screenWidth * 2, y: locationY }, { x, y }]);
    } else {
      setPoints([{ x, y }]);
    }
    const hue = Math.floor(Math.random() * 360);
    const lightness = 75 + Math.floor(Math.random() * 25);
    setColor(`hsl(${hue}, 100%, ${lightness}%)`);
  };


  const handleTouchMove = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    let x = locationX;
    let y = locationY;
    if (locationX <= screenWidth * 0.1) {
      x = -screenWidth;
    } else if (locationX >= screenWidth * 0.9) {
      x = screenWidth * 2;
    }
    setPoints((points) => [...points, { x, y }]);
    let pathString = '';
    for (let i = 0; i <= 1; i += 0.01) {
      const point = bSpline(points, Math.min(100, points.length - 1), i);
      if (i === 0) {
        pathString += `M ${point.x} ${point.y}`;
      } else {
        pathString += ` L ${point.x} ${point.y}`;
      }
    }
    setPath(pathString);
  };

  const handleTouchEnd = () => {
    setTypeable(true);
    if (points.length > 0) {
      setPaths((paths) => [...paths, { id: Math.random().toString(36).substring(7), label: '', path, color }]);
      setPoints([]);
      setPath('');
    }
  };

  const handleTap = () => {
    if (points.length === 0 && paths.length > 0) {
      const hue = Math.floor(Math.random() * 360);
      const lightness = 75 + Math.floor(Math.random() * 25);
      const newColor = `hsl(${hue},100%,${lightness}%)`;
      setPaths((paths) =>
        paths.map((pathObj, index) =>
          index === paths.length - 1 ? { ...pathObj, color: newColor } : pathObj
        )
      );
    }
  };


  return (
    <View
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleTap}
    >

      {
        typeable && <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, display: "none" }}
          //focus the text input on component mount
          autoFocus={true}
          onChangeText={text => {
            setTempText(text)
            const lastPath = paths[paths.length - 1];
            const lastPathId = lastPath.id;
            const lastPathLabel = lastPath.label;
            const lastPathColor = lastPath.color;
            const lastPathPath = lastPath.path;
            const lastPathIndex = paths.length - 1;
            const newPaths = paths.filter((path) => path.id !== lastPathId);
            setPaths([...newPaths, { id: lastPathId, label: text, path: lastPathPath, color: lastPathColor }]);
          }}
          //after pressing enter (or return) we want to stop editing the text input
          onEndEditing={() => {
            setTypeable(false)
            setTempText('')
          }}

          value={tempText}
        />
      }

      <Svg style={styles.svg}>
        {paths.map((pathObj, index) => (
          <G
            key={index}
          >
            <Path
              id={`textPath${index}`}
              d={pathObj.path}
              stroke={pathObj.color}
              strokeWidth={30}
              fill="none"
            />
            <SVGText
            >
              <TextPath href={`#textPath${index}`}>
                {pathObj?.label}
                {/* <Animatable.Text
                  animation={{
                    // animate text along pathObj.path
                    
                    from: { x: 0, y: 0 },
                    to: { x: 1, y: 0 },
                  }}
                  iterationCount="infinite"
                  duration={7000}
                  easing="linear"
                >{pathObj?.label}</Animatable.Text> */}
              </TextPath>
            </SVGText>
          </G>
        ))}
        <Path d={path} stroke={color} strokeWidth={30} fill="none" />
      </Svg>
    </View>
  );
}

const getTextPosition = (path) => {
  // path is d attribute of path element
  const pathLength = path.getTotalLength();
  const start = path.getPointAtLength(0);
  const end = path.getPointAtLength(pathLength);
  const middle = path.getPointAtLength(pathLength / 2);
  return { start, end, middle };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  svg: {
    flex: 1,
  },
});