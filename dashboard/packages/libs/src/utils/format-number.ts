import numeral from 'numeral';

// ----------------------------------------------------------------------

type InputValue = string | number | null;

export function fNumber(number: InputValue) {
  return numeral(number).format();
}

export function fCurrency(number: InputValue) {
  const format = number ? numeral(number).format('0,0.00') : '';
  return result(format, '.00');
}

export function fPercent(number: InputValue) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number: InputValue) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number: InputValue) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

export function fCommas(number: InputValue) {
  return numeral(number).format('0,0').replace(/,/g, '.');
}

function result(format: string, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

export function fPercentNumber(number: InputValue) {
  return numeral(number).format('0.0%');
}

export function fNumberWithDecimals(
  number: number,
  numberOfDecimals = 2,
  roundInteger = false,
) {
  if (number === 0)
    return roundInteger ? '0' : `0.${'0'.repeat(numberOfDecimals)}`;

  const absNumber = Math.abs(number);
  const minThreshold = 10 ** -numberOfDecimals;

  if (roundInteger && Number.isInteger(number)) {
    return String(number);
  }

  if (absNumber < minThreshold && absNumber > 0) {
    const neededDecimals =
      Math.ceil(-Math.log10(absNumber)) + numberOfDecimals - 1;
    const formatString = `0.${'0'.repeat(neededDecimals)}`;
    return numeral(number).format(formatString);
  }

  const formatString = `0.${'0'.repeat(numberOfDecimals)}`;
  return numeral(number).format(formatString);
}
