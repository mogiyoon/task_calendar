import { createContext, useState, useContext, ReactNode, FC, useEffect } from 'react';

interface DateContextType {
  year: number;
  month: number;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  
  focusedDate: Date | null;
  setFocusedDate: React.Dispatch<React.SetStateAction<Date | null>>;

  isMonthMode: boolean;
  setIsMonthMode: React.Dispatch<React.SetStateAction<boolean>>;

  focusedWeek: Date;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;

  handlePrev: () => void;
  handleNext: () => void;
}

const DateContext = createContext<DateContextType | null>(null);

interface DateProviderProps {
  children: ReactNode;
}

export const DateProvider: FC<DateProviderProps> = ({ children }) => {
  /**
   * initialize date, month, year
   */
  const [date, setDate] = useState(new Date());
  const month = date.getMonth();
  const year = date.getFullYear();
  
  /**
   * @focusedDate is used when user press day
   * @focusedWeek is the first day of week in week mode
   */
  const weekFirstDate = new Date(date);
  weekFirstDate.setDate(weekFirstDate.getDate() - weekFirstDate.getDay());
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [focusedWeek, setFocusedWeek] = useState<Date>(weekFirstDate);
  
  const [isMonthMode, setIsMonthMode] = useState<boolean>(true);

  const handleNextWeek = () => {
    setFocusedWeek((prev) => {
      const nextWeek = new Date(prev);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    })
  }

  const handlePrevWeek = () => {
    setFocusedWeek((prev) => {
      const prevWeek = new Date(prev);
      prevWeek.setDate(prevWeek.getDate() - 7);
      return prevWeek;
    })
  }

  /**
   * if change of focusedWeek change focused month,
   * setDate make old month to new month
   */
  useEffect(() => {
    setDate(focusedWeek)
  }, [focusedWeek])


  /**
   * if the user changes month through month mode,
   * focused week is focusing on the first day of the month
   */
  const handleNextMonth = () => {
    const newMonth = month + 1;
    const newDate = new Date(year, newMonth, 1);
    if (newDate.getDay() !== 0) {
      newDate.setDate(newDate.getDate() + (7 - newDate.getDay()));
    }
    setFocusedWeek(newDate);
  }

  const handlePrevMonth = () => {
    const newMonth = month - 1;
    const newDate = new Date(year, newMonth, 1);
    if (newDate.getDay() !== 0) {
      newDate.setDate(newDate.getDate() + (7 - newDate.getDay()));
    }
    setFocusedWeek(newDate);
  }

  const handleNext = () => {
    if (isMonthMode) {
      handleNextMonth();
    } else {
      handleNextWeek();
    }
  }

  const handlePrev = () => {
    if (isMonthMode) {
      handlePrevMonth();
    } else {
      handlePrevWeek();
    }
  }

  const value: DateContextType = {
    month: month,
    year: year,
    handlePrevMonth: handlePrevMonth,
    handleNextMonth: handleNextMonth,

    focusedDate,
    setFocusedDate: setFocusedDate,
    
    isMonthMode: isMonthMode,
    setIsMonthMode: setIsMonthMode,

    focusedWeek,
    handleNextWeek: handleNextWeek,
    handlePrevWeek: handlePrevWeek,

    handleNext: handleNext,
    handlePrev: handlePrev
  };

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}

export const useDateContext = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
}