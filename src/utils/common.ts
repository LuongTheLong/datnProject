import dayjs from "dayjs";
import "dayjs/locale/vi";

const imgToBase64 = (file: File | undefined): Promise<string> => {
  return new Promise(resolve => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      return;
    }

    return resolve("");
  });
};

const formatDate = (date: Date) => {
  return dayjs(date).locale("vi").format("dddd, DD-MM-YYYY, hh:mm:ss");
};

export { imgToBase64, formatDate };
