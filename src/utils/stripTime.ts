export const stripTime = (date: Date) => {
  const x = new Date(date);
  x.setHours(0, 0, 0, 0);
  return x;
}