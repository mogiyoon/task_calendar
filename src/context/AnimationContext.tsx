import { createContext, FC, ReactNode, useContext } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

interface AnimationContextType {
  shouldAnimate: SharedValue<boolean>;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider: FC<AnimationProviderProps> = ({children}) => {
  const shouldAnimate = useSharedValue(false);

  const value: AnimationContextType = {
    shouldAnimate: shouldAnimate,
  }

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within a AnimationProvider');
  }
  return context;
}