import React from 'react';

import {StyleSheet, View} from 'react-native';
import {ColorSelector} from './tools/ColorSelector';
import {UndoButton} from './tools/UndoButton';

type BarProps = {
    selectColor(color: string): void;
    undoAction(): void;
};

export const Bar = (props: BarProps) => {
    const {selectColor, undoAction} = props;

    return (
        <View style={styles.containerStyle}>
            <View style={styles.topSection}>
                <UndoButton undoAction={undoAction} />
            </View>
            <View style={styles.bottomSection}>
                <ColorSelector onSelectColor={selectColor} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: '#fff',
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    topSection: {
        flexDirection: 'row',
        flex: 1,
    },
    bottomSection: {
        flexDirection: 'row',
    },
});
