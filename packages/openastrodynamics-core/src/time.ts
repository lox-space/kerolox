export const SECONDS_PER_DAY = 86400;

export const unixToJulian = (unix: number) => ({
  date1: 2440587.5,
  date2: unix / SECONDS_PER_DAY,
});
