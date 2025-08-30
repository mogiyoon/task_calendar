import { createContext, FC, ReactNode, useContext } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

interface AnimationContextType {
  shouldAnimateY: SharedValue<boolean>;
  shouldAnimateX: SharedValue<boolean>;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider: FC<AnimationProviderProps> = ({children}) => {
  const shouldAnimateY = useSharedValue(false);
  const shouldAnimateX = useSharedValue(false);

  const value: AnimationContextType = {
    shouldAnimateY: shouldAnimateY,
    shouldAnimateX: shouldAnimateX,
  }

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within a AnimationProvider');
  }
  return context;
}