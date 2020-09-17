import React from 'react';

import {StyleSheet, View, TouchableOpacity} from 'react-native';

type ColorButtonProps = {
    onPress(color: string): void;
    buttonColor: string;
};

const ColorButton = (props: ColorButtonProps) => {
    const {onPress, buttonColor} = props;

    const customStyles = {
        backgroundColor: buttonColor,
        borderColor: buttonColor,
        borderWidth: 1,
    };
    return (
        <TouchableOpacity onPress={() => onPress(buttonColor)}>
            <View style={[styles.circleButtonStyle, customStyles]} />
        </TouchableOpacity>
    );
};

type ColorSelectorProps = {
    onSelectColor(color: string): void;
};

export const ColorSelector = (props: ColorSelectorProps) => {
    const {onSelectColor} = props;
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
});
