import {GestureResponderEvent} from 'react-native';
import {CanvasAction} from './reducer/';

type HandlerProps = {
  evt: GestureResponderEvent;
  dispatch: (value: CanvasAction) => void;
};

/** When User Touches And Moves on Screen for Pencil */
export const HandleOnScreenPencilTouchAndMove = (props: HandlerProps) => {
  const {dispatch, evt} = props;
  dispatch({
    type: 'TouchPencilDrawing',
    PencilInfo: {
      TimeStamp: evt.nativeEvent.timestamp,
      Start: {
        X: evt.nativeEvent.locationX,
        Y: evt.nativeEvent.locationY,
      },
    },
  });
};
