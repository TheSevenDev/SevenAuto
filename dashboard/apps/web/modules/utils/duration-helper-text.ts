import { TTranslate } from '../locales';
import { fNumber } from './format-number';

export const durationHelperText = (
  durationInSeconds: number,
  t: TTranslate,
) => {
  if (!durationInSeconds) return '';

  const seconds = Number(durationInSeconds);
  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = 3600; // 60 * 60
  const SECONDS_IN_DAY = 86400; // 24 * 60 * 60
  const SECONDS_IN_WEEK = 604800; // 7 * 24 * 60 * 60
  const SECONDS_IN_MONTH = 2628000; // approximately 30.42 * 24 * 60 * 60
  const SECONDS_IN_YEAR = 31536000; // 365 * 24 * 60 * 60

  // Years
  if (seconds >= SECONDS_IN_YEAR && seconds % SECONDS_IN_YEAR === 0) {
    const years = seconds / SECONDS_IN_YEAR;
    return years === 1
      ? t('basic.durations.oneYear')
      : t('basic.durations.years', { count: fNumber(years) });
  }

  // Months
  if (seconds >= SECONDS_IN_MONTH && seconds % SECONDS_IN_MONTH === 0) {
    const months = seconds / SECONDS_IN_MONTH;
    return months === 1
      ? t('basic.durations.oneMonth')
      : t('basic.durations.months', { count: fNumber(months) });
  }

  // Weeks
  if (seconds >= SECONDS_IN_WEEK && seconds % SECONDS_IN_WEEK === 0) {
    const weeks = seconds / SECONDS_IN_WEEK;
    return weeks === 1
      ? t('basic.durations.oneWeek')
      : t('basic.durations.weeks', { count: fNumber(weeks) });
  }

  // Days
  if (seconds >= SECONDS_IN_DAY && seconds % SECONDS_IN_DAY === 0) {
    const days = seconds / SECONDS_IN_DAY;
    return days === 1
      ? t('basic.durations.oneDay')
      : t('basic.durations.days', { count: fNumber(days) });
  }

  // Hours
  if (seconds >= SECONDS_IN_HOUR && seconds % SECONDS_IN_HOUR === 0) {
    const hours = seconds / SECONDS_IN_HOUR;
    return hours === 1
      ? t('basic.durations.oneHour')
      : t('basic.durations.hours', { count: fNumber(hours) });
  }

  // Minutes
  if (seconds >= SECONDS_IN_MINUTE && seconds % SECONDS_IN_MINUTE === 0) {
    const minutes = seconds / SECONDS_IN_MINUTE;
    return minutes === 1
      ? t('basic.durations.oneMinute')
      : t('basic.durations.minutes', { count: fNumber(minutes) });
  }

  // Seconds
  if (seconds === 1) {
    return t('basic.durations.oneSecond');
  }

  return t('basic.durations.seconds', { count: fNumber(seconds) });
};
