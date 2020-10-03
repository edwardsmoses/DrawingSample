import React from 'react';

import {TouchableOpacity, Text, StyleSheet} from 'react-native';

type ButtonProps = {
  text: string;
  buttonAction(): void;
  buttonStyle?: {};
};

export const Button = (props: ButtonProps) => {
  const {buttonAction, text, buttonStyle} = props;
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        buttonAction();
      }}>
      {/* TODO - would remove the style from the Text later -- When It's an Icon  */}
      <Text style={[styles.buttonTextStyle, buttonStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
  },
  buttonTextStyle: {
    color: 'black',
  },
});
