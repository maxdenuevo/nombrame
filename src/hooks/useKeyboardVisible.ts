import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

// iOS avisa antes de animar (will*), Android solo después (did*). En web no
// hay eventos y el hook se queda en false.
const SHOW = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const HIDE = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

export function useKeyboardVisible(): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener(SHOW, () => setVisible(true));
    const hide = Keyboard.addListener(HIDE, () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
}
