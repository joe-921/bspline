import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, TextInput, Animated, Easing, View, Text } from 'react-native';
import Svg, { G, Path, Text as SVGText, TextPath } from 'react-native-svg';

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

const AnimatedTextPath = (props) => {
    const x = new Animated.Value(0)

    const [state, setState] = useState(0)

    useEffect(() => {
        x.addListener(({ value }) => {
            setState(value)
        })

        Animated.loop(
            Animated.timing(x, {
                toValue: 100,
                duration: 10000,
                delay: 100,
                easing: Easing.linear,
                useNativeDriver: false,
            })).start()
        


    }, [])

    return (
        <TextPath href={`#textPath${props.index}`} startOffset={`${state}%`}>
            {props.pathObj?.label}
        </TextPath>
    );
};


export default function DrawTextAnimation() {
    const [points, setPoints] = useState([]);
    const [path, setPath] = useState('');
    const [color, setColor] = useState('black');
    const [paths, setPaths] = useState([]);
    const [tempText, setTempText] = useState('');
    const [typeable, setTypeable] = useState(false);

    const handleTouchStart = (event) => {
        setTempText('')
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
        <Animated.View
            style={styles.container}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onStartShouldSetResponder={() => true}
            onResponderRelease={handleTap}
        >
            <View style={styles.headingContainer}>
                <Text style={styles.heading}>Draw on Screen</Text>
            </View>

            {
                typeable && <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, display: "none" }}
                    autoFocus={true}
                    onChangeText={text => {
                        setTempText(text)
                        const lastPath = paths[paths.length - 1];
                        const lastPathId = lastPath.id;
                        const lastPathColor = lastPath.color;
                        const lastPathPath = lastPath.path;
                        const newPaths = paths.filter((path) => path.id !== lastPathId);
                        setPaths([...newPaths, { id: lastPathId, label: text, path: lastPathPath, color: lastPathColor }]);
                    }}
                    onEndEditing={() => {
                        setTypeable(false)
                        setTempText('')
                    }}
                    value={tempText}
                />
            }

            <Svg style={styles.svg}>
                {paths.map((pathObj, index) => {
                    return (
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

                                {
                                    (index + 1 === paths.length && tempText !== "") ?
                                        <TextPath href={`#textPath${index}`}>
                                            {pathObj?.label}
                                        </TextPath>
                                    :
                                    <AnimatedTextPath pathObj={pathObj} index={index} />
                                }



                            </SVGText>
                        </G>
                    )
                })}
                <Path d={path} stroke={color} strokeWidth={30} fill="none" />
            </Svg>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    svg: {
        flex: 1,
    },
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        position: 'absolute',
        top: 50,
        zIndex: 0,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
    },
});