import { createContext, useState, useContext, ReactNode, FC } from 'react';

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
  const [date, setDate] = useState(new Date());
  
  const weekFirstDate = new Date();
  weekFirstDate.setDate(date.getDate() - date.getDay());
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [focusedWeek, setFocusedWeek] = useState<Date>(weekFirstDate);

  const month = date.getMonth();
  const year = date.getFullYear();
  
  const [isMonthMode, setIsMonthMode] = useState(true);

  const handleNextWeek = () => {
    setFocusedWeek((prev) => {
      const nextWeek = new Date(prev);
      nextWeek.setDate(nextWeek.getDate() + 7);
      if (prev.getMonth() !== nextWeek.getMonth()) {
        handleNextMonth();
      }
      return nextWeek;
    })
  }

  const handlePrevWeek = () => {
    setFocusedWeek((prev) => {
      const prevWeek = new Date(prev);
      prevWeek.setDate(prevWeek.getDate() - 7);
      if (prev.getMonth() !== prevWeek.getMonth()) {
        handlePrevMonth();
      }
      return prevWeek;
    })
  }

  const handleNextMonth = () => {
    console.log('handle next month')
    const newMonth = month + 1
    setDate(new Date(year, newMonth));
    setFocusedWeek(() => {
      const newWeek = new Date(year, newMonth, 1);
      newWeek.setDate(newWeek.getDate() - newWeek.getDay());
      return newWeek;
    })
  }

  const handlePrevMonth = () => {
    console.log('handle prev month')
    const newMonth = month - 1
    setDate(new Date(year, newMonth));
    setFocusedWeek(() => {
      const newWeek = new Date(year, newMonth, 1);
      newWeek.setDate(newWeek.getDate() - newWeek.getDay());
      return newWeek;
    })
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

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
}