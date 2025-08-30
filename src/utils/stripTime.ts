/**
 * this function make date with hour to date without hour
 * ex - July 10th 14:20:10 ... => July 10th 0:0:0...
 */
export const stripTime = (date: Date) => {
  const x = new Date(date);
  x.setHours(0, 0, 0, 0);
  return x;
}