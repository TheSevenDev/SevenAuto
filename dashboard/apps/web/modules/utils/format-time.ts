import { ELanguage, enLang, viLang } from '@seven-auto/libs';
import {
  differenceInDays,
  format,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  getTime,
} from 'date-fns';
import { enUS, vi } from 'date-fns/locale';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(
  date: InputValue,
  newFormat?: string,
  language: ELanguage = ELanguage.VI,
) {
  const fm = newFormat || 'dd MMM yyyy';
  const localeMap = {
    [ELanguage.EN]: enUS,
    [ELanguage.VI]: vi,
  };

  return date
    ? format(new Date(date), fm, {
        locale: localeMap[language],
      })
    : '';
}

export function fDateTime(
  date: InputValue,
  newFormat?: string,
  language: ELanguage = ELanguage.VI,
) {
  const fm = newFormat || 'dd MMM yyyy p';

  const localeMap = {
    [ELanguage.EN]: enUS,
    [ELanguage.VI]: vi,
  };

  return date
    ? format(new Date(date), fm, { locale: localeMap[language] })
    : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'HH:mm:ss';
  return date ? format(new Date(date), fm) : '';
}

export function fToNow(date: InputValue, language: ELanguage = ELanguage.VI) {
  const localeMap = {
    [ELanguage.EN]: enUS,
    [ELanguage.VI]: vi,
  };

  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: localeMap[language],
      })
    : '';
}

export function fToNowStrict(
  date: InputValue,
  language: ELanguage = ELanguage.VI,
) {
  const localeMap = {
    [ELanguage.EN]: enUS,
    [ELanguage.VI]: vi,
  };

  // return just now if less than 1 minute
  if (date && new Date(date).getTime() > new Date().getTime() - 60000) {
    return language === ELanguage.EN
      ? viLang.basic.justNow
      : enLang.basic.justNow;
  }

  return date
    ? formatDistanceToNowStrict(new Date(date), {
        addSuffix: true,
        locale: localeMap[language],
      })
    : '';
}

export function fRemainingTime(
  targetDate: InputValue,
  expirationDate?: InputValue,
  options?: {
    dayLabel?: string;
    hourLabel?: string;
    minuteLabel?: string;
    secondLabel?: string;
  },
) {
  if (!targetDate) return '';

  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const expiration = expirationDate ? new Date(expirationDate).getTime() : null;

  // If expiration date is provided, use it as the target
  const endTime = expiration || target;
  const diffTime = endTime - now;

  // If target date is in the past, return empty string
  if (diffTime <= 0) return '';

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  const {
    dayLabel = 'ngày',
    hourLabel = 'giờ',
    minuteLabel = 'phút',
    secondLabel = 'giây',
  } = options || {};

  if (diffDays > 0) {
    return `${diffDays} ${dayLabel}`;
  }

  if (diffHours > 0) {
    return `${diffHours} ${hourLabel}`;
  }

  if (diffMinutes > 0) {
    return `${diffMinutes} ${minuteLabel}`;
  }

  return `${diffSeconds} ${secondLabel}`;
}

// Helper function to get translated time labels
export function getTimeLabels(t: (key: string) => string) {
  return {
    dayLabel: t('basic.days'),
    hourLabel: t('basic.hours'),
    minuteLabel: t('basic.minutes'),
    secondLabel: t('basic.seconds'),
  };
}

export function fDurationDays(startDate: InputValue, endDate: InputValue) {
  if (!startDate || !endDate) return '';
  const duration = differenceInDays(new Date(endDate), new Date(startDate));
  return duration;
}
