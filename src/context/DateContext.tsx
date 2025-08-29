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

  useEffect(() => {
      const baseDate = new Date(focusedDate || date);
      weekFirstDate.setDate(baseDate.getDate() - baseDate.getDay());
      setFocusedWeek(weekFirstDate);
  }, [focusedDate]);


  const month = date.getMonth();
  const year = date.getFullYear();
  
  const [isMonthMode, setIsMonthMode] = useState(true);

  const handleNextWeek = () => {
    setFocusedWeek((prev) => {
      const nextWeek = new Date(prev);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    })
  }

  const handlePrevWeek = () => {
    setFocusedWeek((prev) => {
      const nextWeek = new Date(prev);
      nextWeek.setDate(nextWeek.getDate() - 7);
      return nextWeek;
    })
  }

  const handleNextMonth = () => {
    setDate(new Date(year, month + 1));
  }

  const handlePrevMonth = () => {
    setDate(new Date(year, month - 1));
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
    handlePrevWeek: handlePrevWeek
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