import React from 'react';

import {StyleSheet, View, TouchableOpacity} from 'react-native';

type ColorButtonProps = {
    onPress(color: string): void;
    buttonColor: string;
    currentColor: string;
};

const ColorButton = (props: ColorButtonProps) => {
    const {onPress, buttonColor, currentColor} = props;

    const isCurrentColor = currentColor === buttonColor;
    const customStyles = {
        backgroundColor: buttonColor,
        borderColor: buttonColor,
        borderWidth: 1,
    };

    return (
        <TouchableOpacity onPress={() => onPress(buttonColor)}>
            <View
                style={[
                    styles.circleButtonStyle,
                    customStyles,
                    isCurrentColor ? styles.selectedButtonStyle : null,
                ]}
            />
        </TouchableOpacity>
    );
};

type ColorSelectorProps = {
    onSelectColor(color: string): void;
    currentColor: string;
};

export const ColorSelector = (props: ColorSelectorProps) => {
    const {onSelectColor, currentColor} = props;
    const defaultColors = [
        '#131113',
        '#4cafe6',
        '#f89604',
        '#a06ce0',
        '#e0481f',
    ];

    return (
        <View style={styles.containerStyle}>
            {defaultColors.map((color, index) => (
                <ColorButton
                    currentColor={currentColor}
                    onPress={onSelectColor}
                    buttonColor={color}
                    key={`${color}-${index}`}
                />
            ))}
        </View>
    );
};

const buttonWidth = 45;
const styles = StyleSheet.create({
    containerStyle: {
        alignSelf: 'flex-end',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    circleButtonStyle: {
        height: buttonWidth,
        width: buttonWidth,
        marginVertical: 15,
        marginHorizontal: 5,
        borderRadius: buttonWidth / 2,
    },
    selectedButtonStyle: {
        borderWidth: 8,
        backgroundColor: 'transparent',
    },
});
