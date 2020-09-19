import React from 'react';

import {StyleSheet, View} from 'react-native';
import {ClearButton} from './tools/ClearButton';
import {ColorSelector} from './tools/ColorSelector';
import {UndoButton} from './tools/UndoButton';

type BarProps = {
    selectColor(color: string): void;
    undoAction(): void;
    clearAction(): void;
};

export const Bar = (props: BarProps) => {
    const {selectColor, undoAction, clearAction} = props;

    return (
        <View style={styles.containerStyle}>
            <View style={styles.topSection}>
                <View style={styles.topLeftSection}>
                    <ClearButton clearAction={clearAction} />
                    <UndoButton undoAction={undoAction} />
                </View>
                <View style={styles.topRightSection} />
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
    topRightSection: {},
    bottomSection: {
        flexDirection: 'row',
    },
});
