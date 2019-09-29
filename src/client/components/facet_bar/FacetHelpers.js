export const ISOStringToYear = str => {
  let year = null;
  if (str.charAt(0) == '-') {
    year = parseInt(str.substring(0,5));
  } else {
    year = parseInt(str.substring(0,4));
  }
  return year;
};

export const YearToISOString = ({ year, start }) => {
  const abs = Math.abs(year);
  let s = year.toString();
  let negative = false;
  if (s.charAt(0) == '-') {
    s = s.substring(1);
    negative = true;
  }
  if (abs < 10) {
    s = '000' + s;
  }
  if (abs >= 10 && abs < 100) {
    s = '00' + s;
  }
  if (abs >= 100 && abs < 1000) {
    s = '0' + s;
    s = negative ? s = '-' + s : s;
  }
  s = start ? s + '-01-01' :  s + '-12-31';
  return s;
};
