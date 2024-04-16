import dayjs from "dayjs";

export const format = (time) => {
  return dayjs(time).format("DD/MM/YYYY");
};

export const durationFormat = (duration = 0) => {
  const format = duration < 3600 ? "mm:ss" : "HH:mm:ss";
  return dayjs.duration(duration * 1000).format(format);
};
