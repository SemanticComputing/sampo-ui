export const ISOStringToDate = str => {
  let year;
  let month;
  let day;

  /* TODO: remove this when data has been fixed
     problematic example http://ldf.fi/mmm/time/production_229499
  */
  if (Array.isArray(str)) {
    str = str[0];
  }
  if (str.charAt(0) == '-') {
    year = parseInt(str.substring(0,5));
    month = parseInt(str.substring(7,8));
    day = parseInt(str.substring(10,11));
  } else {
    year = parseInt(str.substring(0,4));
    month = parseInt(str.substring(6,7));
    day = parseInt(str.substring(9,10));
  }
  return new Date(year, month, day);
};
