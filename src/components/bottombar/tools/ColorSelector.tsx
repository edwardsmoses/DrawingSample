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
    const colors = ['red', 'green'];

    return (
        <View style={styles.containerStyle}>
            {colors.map((color, index) => (
                <ColorButton
                    onPress={onSelectColor}
                    buttonColor={color}
                    key={`${color}-${index}`}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        alignSelf: 'flex-end',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    circleButtonStyle: {
        height: 50,
        width: 50,
        marginVertical: 15,
        marginHorizontal: 5,
        borderRadius: 25,
    },
});
