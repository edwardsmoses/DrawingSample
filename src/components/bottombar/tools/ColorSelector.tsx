import React from 'react';

import {StyleSheet, View, TouchableOpacity} from 'react-native';

type ColorButtonProps = {
    onPress(): void;
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
        <TouchableOpacity onPress={() => onPress()}>
            <View style={[styles.circleButtonStyle, customStyles]} />
        </TouchableOpacity>
    );
};

type ColorSelectorProps = {
    onSelectColor(): void;
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
    },
    circleButtonStyle: {
        height: 22,
        width: 22,
        marginTop: 5,
        borderRadius: 50,
    },
});
