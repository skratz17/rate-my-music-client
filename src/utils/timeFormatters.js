/**
 * Given an amount of seconds, convert into string in M:SS format. If provided seconds value is not numeric, will just return the provided value back.
 * @param {any} seconds Amount of seconds to turn into M:SS formatted string. If isNaN, just returns seconds as passed in.
 */
export const convertSecondsToTimeString = seconds => {
  if(isNaN(seconds)) return seconds;
  seconds = parseInt(seconds);
  if(!seconds) return '0:00';

  const minutesPart = Math.floor(seconds / 60);
  let secondsPart = seconds % 60;
  if(secondsPart.toString().length === 1) secondsPart = '0' + secondsPart;

  return `${minutesPart}:${secondsPart}`;
};