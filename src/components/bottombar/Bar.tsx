import React from 'react';

import {StyleSheet, View} from 'react-native';
import {ColorSelector} from './tools/ColorSelector';
import {StrokeSlider} from './tools/StrokeSlider';
import {Button} from './tools/Button';

import {DrawingType} from '../canvas/types';

type BarProps = {
  currentColor: string;
  selectColor(color: string): void;
  undoAction(): void;
  clearAction(): void;
  strokeWidth: number;
  updateStrokeWidth(strokeWidth: number): void;
  updateCurrentDrawingType(drawingType: DrawingType): void;
  currentDrawingType: string;
  captureScreenShot(): void;
};

export const Bar = (props: BarProps) => {
  const {
    selectColor,
    undoAction,
    clearAction,
    strokeWidth,
    updateStrokeWidth,
    currentColor,
    updateCurrentDrawingType,
    currentDrawingType,
    captureScreenShot,
  } = props;

  const SelectedButtonStyle = (drawType: DrawingType) => {
    const buttonStyle =
      currentDrawingType === drawType ? styles.selectedButtonType : undefined;
    return buttonStyle;
  };

  return (
    <View style={styles.containerStyle}>
      <View style={styles.topSection}>
        <View style={styles.topLeftSection}>
          <Button buttonAction={clearAction} text="Clear" />
          <Button buttonAction={undoAction} text="Undo" />
        </View>
        <View style={styles.topRightSection}>
          <View style={styles.drawingTypeSection}>
            <Button
              buttonAction={() => {
                updateCurrentDrawingType(DrawingType.Pencil);
              }}
              text="Pencil"
              buttonStyle={SelectedButtonStyle(DrawingType.Pencil)}
            />
            <Button
              buttonAction={() => {
                updateCurrentDrawingType(DrawingType.Line);
              }}
              text="Line"
              buttonStyle={SelectedButtonStyle(DrawingType.Line)}
            />
            <Button
              buttonAction={() => {
                updateCurrentDrawingType(DrawingType.Circle);
              }}
              text="Circle"
              buttonStyle={SelectedButtonStyle(DrawingType.Circle)}
            />
          </View>
          <Button
            buttonAction={() => {
              captureScreenShot();
            }}
            text="Shot"
          />
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
  selectedButtonType: {
    color: 'red',
    fontWeight: 'bold',
  },
});
