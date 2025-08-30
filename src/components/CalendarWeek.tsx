import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useMemo, useState } from 'react';
import { useDateContext } from '../context/DateContext';
import { stripTime } from '../utils/stripTime';
import { useAnimationContext } from '../context/AnimationContext';
import { runOnJS } from 'react-native-worklets';
import { CalendarDate } from './CalendarDate';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
/*
Week Component
which involves mode change gesture
and week change gesture with animation
*/
interface CalendarWeekProps {
  firstDay: Date;
}

export const CalendarWeek: React.FC<CalendarWeekProps> = ({ firstDay }) => {
  const { focusedWeek, isMonthMode, setIsMonthMode, handlePrevWeek, handleNextWeek } = useDateContext();
  const { shouldAnimateY, shouldAnimateX } = useAnimationContext();
  const [showComponentY, setShowComponentY] = useState(false);
  const { width: screenWidth} = useWindowDimensions();

  /**
   * prev week, this week, next week
   * these array are used render prev/next week animation
   */
  const thisWeek: Date[] = [];
  const tmpDate = new Date(firstDay);
  for (let i = 0; i < 7; i++) {
    thisWeek.push(new Date(tmpDate));
    tmpDate.setDate(tmpDate.getDate() + 1);
  }

  const prevWeek: Date[] = [];
  const tmpPrevDate = new Date(firstDay);
  tmpPrevDate.setDate(tmpPrevDate.getDate() - 7)
  for (let i = 0; i < 7; i++) {
    prevWeek.push(new Date(tmpPrevDate));
    tmpPrevDate.setDate(tmpPrevDate.getDate() + 1);
  }

  const nextWeek: Date[] = [];
  const tmpNextDate = new Date(firstDay);
  tmpNextDate.setDate(tmpNextDate.getDate() + 7)
  for (let i = 0; i < 7; i++) {
    nextWeek.push(new Date(tmpNextDate));
    tmpNextDate.setDate(tmpNextDate.getDate() + 1);
  }

  /**
   * this const checks whether this week is the focused week or not
   */
  const isThisWeek =
    stripTime(firstDay).getTime() === stripTime(focusedWeek).getTime();

  /**
   * if the user swipes this component vertically,
   * @offsetX changes value as user swipes @onUpdated
   * the value is reflected in @animatedPagerStyle
   */
  const offsetX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      if (!isMonthMode) {
        offsetX.value = event.translationX;
      }
    })
    .onEnd(event => {
      const SWIPE_THRESHOLD = screenWidth / 3;

      /**
       * this function changes mode (week <-> month)
       */
      if (event.translationY < -50 && isMonthMode) {
        shouldAnimateY.value = true;
        runOnJS(setIsMonthMode)(false);
      } else if (event.translationY > 50 && !isMonthMode) {
        shouldAnimateY.value = true;
        runOnJS(setIsMonthMode)(true);
      }
      /**
       * this function changes week
       */
      else if (!isMonthMode) {
        if (event.translationX < -SWIPE_THRESHOLD) {
          offsetX.value = withTiming(-screenWidth, {}, () => {
            shouldAnimateX.value = true;
            runOnJS(handleNextWeek)();
          });
        } else if (event.translationX > SWIPE_THRESHOLD) {
          offsetX.value = withTiming(screenWidth, {}, () => {
            shouldAnimateX.value = true;
            runOnJS(handlePrevWeek)();
          });
        } else {
          offsetX.value = withTiming(0);
        }
      }
    });

  const focusedWeekSV = useSharedValue(stripTime(focusedWeek).getTime());

  /**
   * Make the offset update coincide with the frame
   * in which the UI thread updates the focused week.
   */
  useEffect(() => {
    focusedWeekSV.value = stripTime(focusedWeek).getTime();
  }, [focusedWeek]);

  useAnimatedReaction(
    () => focusedWeekSV.value,
    () => {
      if (shouldAnimateX.value) {
        offsetX.value = 0;
        shouldAnimateX.value = false;
      }
    }
  );

  /**
   * when the week change animation ends,
   * useEffect will aligns the week component
   */
  useEffect(() => {
    offsetX.value = 0;
  }, [isMonthMode])

  /**
   * when the components are rendered,
   * month mode affects their height and opacity
   * if the mode isn't month mode, 
   * week component is rendered only for this week
   */
  const initialHeight = isMonthMode || isThisWeek ? 48 : 0;
  const calendarWeekHeight = useSharedValue(48);
  const animatedWeekHeight = useSharedValue(initialHeight);

  const initialOpacity = isMonthMode || isThisWeek ? 1 : 0;
  const calendarWeekOpacity = useSharedValue(1);
  const animatedWeekOpacity = useSharedValue(initialOpacity);

  /**
   * Show Component is only true
   * while the mode change animation is running.
   * That is, even if isMonthMode is false,
   * if the animation works,
   * not only this week but also other weeks are visible
   */
  useAnimatedReaction(
    () => {
      return shouldAnimateY.value;
    },
    (animate, prevAnimate) => {
      if (animate !== prevAnimate) {
        runOnJS(setShowComponentY)(animate);
      }
    }
  );


  /**
   * mode change animation.
   * change height and opacity
   */
  useEffect(() => {
    if (isThisWeek) {
      animatedWeekHeight.value = calendarWeekHeight.value;
      animatedWeekOpacity.value = calendarWeekOpacity.value;
    } else {
      if (shouldAnimateY.value) {
        animatedWeekHeight.value = withTiming(
          isMonthMode ? calendarWeekHeight.value : 0,
          {
            duration: 1000,
          },

          finished => {
            if (finished) {
              shouldAnimateY.value = false;
            }
          },
        );
        animatedWeekOpacity.value = withTiming(
          isMonthMode ? calendarWeekOpacity.value : 0,
          {
            duration: 800,
          },
        );
      } else {
        /**
         * if the mode change has ended,
         * there is no need to animate other weeks
         */
        animatedWeekHeight.value = isMonthMode ? calendarWeekHeight.value : 0;
        animatedWeekOpacity.value = isMonthMode ? calendarWeekOpacity.value : 0;
      }
    }
  }, [
    isMonthMode,
    isThisWeek,
    animatedWeekHeight,
    animatedWeekOpacity,
    calendarWeekHeight,
    calendarWeekOpacity,
    shouldAnimateY,
    focusedWeek,
  ]);

  const animatedWeekContainerStyle = useAnimatedStyle(() => {
    return {
      height: animatedWeekHeight.value,
      opacity: animatedWeekOpacity.value,
      overflow: 'hidden',
    };
  });
  
  const animatedPagerStyle = useAnimatedStyle(() => {
    const xPosition = offsetX.value;
    return {
      transform: [{ translateX: xPosition }],
    };
  });

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        pagerContainer: {
          width: screenWidth * 3,
        },
        weekPage: {
          width: screenWidth,
        },
      }),
    [screenWidth]
  );

  return (
  <>
    {(isMonthMode || isThisWeek || showComponentY) && (
      <View>
        <Animated.View style={animatedWeekContainerStyle} >
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[weekContainerStyles.pagerContainer, dynamicStyles.pagerContainer, animatedPagerStyle]}>
                {!isMonthMode && <View style={[weekContainerStyles.weekPageBase, dynamicStyles.weekPage]}>
                  {prevWeek.map(date => (
                    <CalendarDate key={date.getTime()} detailDate={date} />
                  ))}
                </View>}
                  <View style={[weekContainerStyles.weekPageBase, dynamicStyles.weekPage]}>
                    {thisWeek.map(date => (
                      <CalendarDate key={date.getTime()} detailDate={date} />
                    ))}
                  </View>
                {!isMonthMode && <View style={[weekContainerStyles.weekPageBase, dynamicStyles.weekPage]}>
                  {nextWeek.map(date => (
                    <CalendarDate key={date.getTime()} detailDate={date} />
                  ))}
                </View>}
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </View>
    )}
  </>
  );
};

const weekContainerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagerContainer: {
    flexDirection: 'row',
  },
  weekPageBase: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
