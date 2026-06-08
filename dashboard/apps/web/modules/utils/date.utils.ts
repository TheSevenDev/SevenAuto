import * as dateFns from 'date-fns';

export const getMondayOfTheWeek = (date = new Date()) =>
  dateFns.startOfWeek(date, { weekStartsOn: 1 });

export const getSundayOfTheWeek = (date = new Date()) =>
  dateFns.endOfWeek(date, { weekStartsOn: 1 });

export const getWeekNumber = (date = new Date()) =>
  dateFns.getWeek(date, { weekStartsOn: 1 });

export const getListWeekOfMonths = (date = new Date()) => {
  const startOfMonth = dateFns.startOfMonth(date);
  const endOfMonth = dateFns.endOfMonth(date);

  const startWeek = getMondayOfTheWeek(startOfMonth);
  const endWeek = getMondayOfTheWeek(endOfMonth);

  const listWeek = [];
  let currentWeek = startWeek;

  while (currentWeek <= endWeek) {
    listWeek.push(currentWeek);
    currentWeek = dateFns.addWeeks(currentWeek, 1);
  }

  return listWeek;
};

export const getListWeekBetweenDates = (startDate: Date, endDate: Date) => {
  const startWeek = getMondayOfTheWeek(startDate);
  const endWeek = getMondayOfTheWeek(endDate);

  const listWeek = [];
  let currentWeek = startWeek;

  while (currentWeek <= endWeek) {
    listWeek.push(currentWeek);
    currentWeek = dateFns.addWeeks(currentWeek, 1);
  }

  return listWeek;
};

export const getStartOfMonth = (date = new Date()) =>
  dateFns.startOfMonth(date);

export const getEndOfMonth = (date = new Date()) => dateFns.endOfMonth(date);

export const getBetweenDateOfWeek = (date = new Date()) => {
  const startWeek = getMondayOfTheWeek(date);
  const endWeek = getSundayOfTheWeek(date);

  return { startWeek, endWeek };
};

export const getBetweenDateOfWeekString = (date = new Date()) => {
  const { startWeek, endWeek } = getBetweenDateOfWeek(date);

  return `${dateFns.format(startWeek, 'dd/MM/yyyy')} - ${dateFns.format(
    endWeek,
    'dd/MM/yyyy',
  )}`;
};
