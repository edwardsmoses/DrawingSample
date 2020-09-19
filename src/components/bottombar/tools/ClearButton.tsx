import React from 'react';

import {View, TouchableOpacity, Text} from 'react-native';

type ClearButtonProps = {
    clearAction(): void;
};

export const ClearButton = (props: ClearButtonProps) => {
    const {clearAction} = props;
    return (
        <TouchableOpacity
            onPress={() => {
                clearAction();
            }}>
            <View>
                <Text>Clear</Text>
            </View>
        </TouchableOpacity>
    );
};
