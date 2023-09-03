import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, TextInput, Animated, Easing, View, Text, Keyboard } from 'react-native';
import Svg, { G, Path, Text as SVGText, TextPath, Image, TSpan, SvgUri } from 'react-native-svg';
import {
    useFonts,
    SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { textToFlagEmoji } from './emoji';

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
    const x = new Animated.Value(2)
    const [state, setState] = useState(2)

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

    // Calculate the position of the avatar relative to the text
    const point = bSpline(props.pathObj?.points, Math.min(100, props.pathObj?.points.length - 1), state / 100);
    // calculate the position of the text
    const textWidth = props.pathObj?.label.length * 14;
    const textHeight = 35;
    return (
        <View style={{ flexDirection: 'row' }}>
            <TextPath href={`#textPath${props.index}`} startOffset={`${state}%`}>
                {props.pathObj?.label}
                <Image
                    href={require('./user/avatar1.png')}
                    x={point.x + textWidth}
                    y={point.y - textHeight}
                    width={40}
                    height={40}
                />
            </TextPath>
        </View>
    );
};

export default function NewAnimation() {
    const [points, setPoints] = useState([]);
    const [path, setPath] = useState('');
    const [color, setColor] = useState('black');
    const [paths, setPaths] = useState([]);
    const [tempText, setTempText] = useState('');
    const [typeable, setTypeable] = useState(false);
    const [textColor, setTextColor] = useState('black');

    let [fontsLoaded] = useFonts({
        'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleTouchStart = (event) => {
        Keyboard.dismiss();
        setTempText('')
        const { locationX, locationY } = event.nativeEvent;
        let x = locationX;
        let y = locationY;
        if (locationX <= screenWidth * 0.1) {
            setPoints([{ x: 0, y: locationY }, { x, y }]);
        } else if (locationX >= screenWidth * 0.9) {
            setPoints([{ x: screenWidth, y: locationY }, { x, y }]);
        } else {
            setPoints([{ x, y }]);
        }

        // Define the list of colors
        const colors = ['#4b917d', '#f037a5', '#cdf564', '#4000F5', '#9cF0E1', '#FCDD27', '#3433E2', '#FF1D00'];

        // Randomly select a color from the list
        const colorIndex = Math.floor(Math.random() * colors.length);
        const color = colors[colorIndex];

        setColor(color);

        // Define the list of text colors
        const textColors = ['#FFFFFF', '#DDDDDD', ...colors.filter(c => c !== color)];

        // Randomly select a text color from the list
        const textColorIndex = Math.floor(Math.random() * textColors.length);
        const textColorr = textColors[textColorIndex];
        // Set the text color
        setTextColor(textColorr);
    };


    const handleTouchMove = (event) => {
        const { locationX, locationY } = event.nativeEvent;
        let x = locationX;
        let y = locationY;
        if (locationX <= screenWidth * 0.1) {
            x = 0;
        } else if (locationX >= screenWidth * 0.9) {
            x = screenWidth + 25;
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
        if (points.length > 0) {
            // Check if the stroke starts and ends at the edge of the screen
            const startsNearEdge = points[0].x <= screenWidth * 0.1 || points[0].x >= screenWidth * 0.9;
            const endsNearEdge = points[points.length - 1].x <= screenWidth * 0.1 || points[points.length - 1].x >= screenWidth * 0.9;
            // Only add the path and show the keyboard if the stroke starts and ends near the edge
            if (startsNearEdge && endsNearEdge) {
                setTypeable(true);
                setPaths((paths) => [...paths.map(path => ({ ...path })), { id: Math.random().toString(36).substring(7), label: '', path, color, textColor, points }]);
            }
            setPoints([]);
            setPath('');
        }
    };

    return (
        <Animated.View
            style={styles.container}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onStartShouldSetResponder={() => true}
        >
            <View style={styles.headingContainer}>
                <Text style={styles.heading}>Draw on Screen❤️</Text>
            </View>

            {
                typeable && <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, display: "none" }}
                    autoFocus={true}
                    onChangeText={text => {
                        const emojiText = textToFlagEmoji(text);
                        setTempText(text)
                        const lastPath = paths[paths.length - 1];
                        const lastPathId = lastPath.id;
                        const lastPathColor = lastPath.color;
                        const lastPathPath = lastPath.path;
                        const newPaths = paths.map(path => path.id === lastPathId ? { ...path, label: emojiText } : { ...path });
                        setPaths(newPaths);
                    }}
                    onEndEditing={() => {
                        setTypeable(false)
                        setTempText('')
                    }}
                    value={tempText}
                />
            }

            <Svg style={styles.svg}>
                {fontsLoaded && paths.map((pathObj, index) => {
                    return (
                        <G
                            key={index}
                        >
                            <Path
                                id={`textPath${index}`}
                                d={pathObj.path}
                                stroke={pathObj.color}
                                strokeWidth={50}
                                fill="none"
                            />
                            <SVGText
                                fill={pathObj.textColor}
                                fontFamily='SpaceGrotesk-Bold'
                                fontSize={32}
                                fontWeight='700'
                                alignmentBaseline='central'
                            >
                                {/* <TextPath href={`#textPath${index}`} startOffset="10%">
                                    {pathObj?.label}
                                </TextPath>
                                <Image
                                    href={require('./user/avatar1.jpg')}
                                    x={pathObj?.points[pathObj?.points.length - 1].x + 10}
                                    y={pathObj?.points[pathObj?.points.length - 1].y - 20}
                                    width={40}
                                    height={40}
                                /> */}
                                {
                                    (index + 1 === paths.length && tempText !== "") ?
                                        <View style={{ position: 'relative' }}>
                                            <TextPath href={`#textPath${index}`} startOffset="2%">
                                                {pathObj?.label}
                                            </TextPath>
                                        </View>
                                        :
                                        <AnimatedTextPath pathObj={pathObj} index={index} />
                                }
                            </SVGText>
                        </G>
                    )
                })}
                <Path d={path} stroke={color} strokeWidth={50} fill="none" />
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
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'SpaceGrotesk-Bold',
        color: 'black',
    },
});