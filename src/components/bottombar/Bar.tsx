import React from 'react';

import {StyleSheet, View} from 'react-native';
import {ColorSelector} from './tools/ColorSelector';
import {StrokeSlider} from './tools/StrokeSlider';
import {Button} from './tools/Button';

type BarProps = {
    currentColor: string;
    selectColor(color: string): void;
    undoAction(): void;
    clearAction(): void;
    strokeWidth: number;
    updateStrokeWidth(strokeWidth: number): void;
};

export const Bar = (props: BarProps) => {
    const {
        selectColor,
        undoAction,
        clearAction,
        strokeWidth,
        updateStrokeWidth,
        currentColor,
    } = props;

    return (
        <View style={styles.containerStyle}>
            <View style={styles.topSection}>
                <View style={styles.topLeftSection}>
                    <Button buttonAction={clearAction} text="Clear" />
                    <Button buttonAction={undoAction} text="Undo" />
                </View>
                <View style={styles.topRightSection}>
                    <View style={styles.drawingTypeSection}>
                        <Button buttonAction={() => {}} text="Pencil" />
                        <Button buttonAction={() => {}} text="Line" />
                        <Button buttonAction={() => {}} text="Cicle" />
                    </View>
                    <Button buttonAction={() => {}} text="Send" />
                </View>
            </View>
            <View style={styles.bottomSection}>
                <StrokeSlider
                    strokeWidth={strokeWidth}
                    updateStrokeWidth={updateStrokeWidth}
                />
                <ColorSelector
                    onSelectColor={selectColor}
                    currentColor={currentColor}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: '#fff',
        width: '100%',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    topSection: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
    },
    topLeftSection: {
        marginHorizontal: 10,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
    },
    topRightSection: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
    },
    drawingTypeSection: {
        flexDirection: 'row',
    },
    bottomSection: {
        flexDirection: 'row',
    },
});
