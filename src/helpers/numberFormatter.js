import numeral from 'numeral';

export function formatNumber(number) {
  if (Number(number) <= 99999) {
    return numeral(Number(number)).format('0,0');
  }
  if (Number(number) > 99999 && number < 999999) {
    return numeral(Number(number)).format('0,0.00a');
  }
  if (Number(number) >= 999999) {
    return numeral(Number(number)).format('0,0.0000a');
  }
  return numeral(Number(number));
}