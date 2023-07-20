export const convertSecondsToMinutesAndSeconds = (time: number) => {
  let hours = Math.floor(time / 3600);
  let mins = "0" + Math.floor((time % 3600) / 60);
  let secs = "0" + Math.floor(time % 60);

  mins = mins.substr(mins.length - 2);
  secs = secs.substr(secs.length - 2);

  if (typeof secs === "string") {
    if (hours) {
      return `${hours}:${mins}:${secs}`;
    }
    return `${mins}:${secs}`;
  }
  return "00:00";
};
