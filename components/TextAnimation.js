import { StyleSheet, Text, TextInput, View } from "react-native"
import React, { useEffect, useState, useRef } from 'react';
import * as Animatable from 'react-native-animatable';

const TouchBox = ({ x, y }) => {
    const [text, setText] = useState('');
    const [visible, setVisible] = useState(true)
    const textInputRef = useRef(null);

    useEffect(() => {
        if (visible) {
            textInputRef.current.focus();
        }
    }, [visible]);

    const slideInRight = {
        from: {
            translateX: 0,
        },
        to: {
            translateX: 250,
        },
    };

    return (
        <View style={{ position: 'absolute', left: x, top: y }}>
            {
                visible ?
                    <TextInput
                        ref={textInputRef}
                        style={styles.textBox}
                        placeholder="Type something"
                        value={text}
                        onChangeText={setText}
                        onBlur={() => text !== "" && setVisible(false)}
                    />
                    :
                    <View style={styles.textBox}>
                        <Animatable.Text
                            animation={slideInRight}
                            iterationCount="infinite"
                            duration={7000}
                            easing="linear"
                        >{text}</Animatable.Text>
                    </View>
            }
        </View>
    );
};

export default () => {

    const [boxes, setBoxes] = useState([]);

    const handlePress = (event) => {
        const { locationX, locationY } = event.nativeEvent;

        // Check if the touch event occurs inside of any existing input boxes
        for (const box of boxes) {
            const boxLeft = box.x;
            const boxRight = box.x + 200;
            const boxTop = box.y;
            const boxBottom = box.y + 40;

            if (
                locationX >= boxLeft &&
                locationX <= boxRight &&
                locationY >= boxTop &&
                locationY <= boxBottom
            ) {
                // If touch is inside an existing box, do nothing
                return;
            }
        }

        // If touch is outside all existing boxes, create a new one
        setBoxes([...boxes, { x: locationX, y: locationY }]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.touchBox} onTouchStart={handlePress}>
                <View style={styles.headingView}>
                    <Text style={styles.heading}>Touch Any Where in the box!</Text>
                </View>
            </View>

            {boxes.map((box, index) => (
                <TouchBox key={index} x={box.x} y={box.y} />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    touchBox: {
        height: 450,
        borderWidth: 1,
        marginTop: 50,
        marginHorizontal: 10,
        borderRadius: 10,
    },
    headingView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 10
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold"
    },
    textBox: {
        color: 'black',
        fontSize: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: '#E8FF9F',
        zIndex: 999,
        width: 250,
        height: 40,
        justifyContent: 'center',
        overflow: 'hidden'
    }
})