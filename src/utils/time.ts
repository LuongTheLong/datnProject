import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TIME_NOW = (time?: string) => dayjs(time).tz("Asia/Ho_Chi_Minh");

const formatDate = (time: number): string => {
  return dayjs(time).tz("Asia/Ho_Chi_Minh").format("YYYYMMDDHHmmss");
};

const formatTime = (time: string) => {
  return dayjs(time).tz("Asia/Ho_Chi_Minh").format("HH:mm");
};

const customTime = ({ hour, minute }: { hour: number; minute: number }) => {
  return dayjs().tz("Asia/Ho_Chi_Minh").hour(hour).minute(minute);
};

const isTimeAvailable = (params: { minute: number; hour: number } | string) => {
  const hourNow = VN_TIME_NOW().get("hour");
  const minuteNow = VN_TIME_NOW().get("minute");
  let hour = 0;
  let minute = 0;

  if (typeof params === "string") {
    hour = VN_TIME_NOW(params).get("hour");
    minute = VN_TIME_NOW(params).get("minute");
  }

  if (typeof params === "object") {
    hour = params.hour;
    minute = params.minute;
  }

  if (hour * 60 + minute - (hourNow * 60 + minuteNow) > 15) {
    return true;
  }

  return false;
};

const deliveryNowTime = () => {
  const now = VN_TIME_NOW();
  const isMinuteExcessive = VN_TIME_NOW().minute() + 20 >= 60;

  const deliverHour = isMinuteExcessive ? now.hour() + 1 : now.hour();
  const deliverMinute = isMinuteExcessive ? now.minute() + 20 - 60 : now.minute() + 20;

  const from = now.toISOString();
  const to = now.hour(deliverHour).minute(deliverMinute).toISOString();

  return { from, to };
};

const isStoreOpened = () => {
  const hour = dayjs().tz("Asia/Ho_Chi_Minh").hour();

  return hour > 6 && hour < 22;
};

export { formatDate, formatTime, customTime, isStoreOpened, VN_TIME_NOW, isTimeAvailable, deliveryNowTime };
