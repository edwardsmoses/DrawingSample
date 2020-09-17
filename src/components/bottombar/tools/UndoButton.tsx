import React from 'react';

import {View, TouchableOpacity, Text} from 'react-native';

type UndoButtonProps = {
    undoAction(): void;
};

export const UndoButton = (props: UndoButtonProps) => {
    const {undoAction} = props;
    return (
        <TouchableOpacity
            onPress={() => {
                undoAction();
            }}>
            <View>
                <Text>Undo</Text>
            </View>
        </TouchableOpacity>
    );
};
