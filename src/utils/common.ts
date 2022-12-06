import dayjs from "dayjs";
import type { ProductOptions, OptionCategory } from "@shared/validators/options-validator";
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

type CalculateOptionsTotalParams = {
  values: ProductOptions;
  price: number;
};

const calculateOptionsTotal = ({ values, price }: CalculateOptionsTotalParams): number => {
  const { quantity, ...rest } = values;
  let total = price * quantity;
  for (const property in rest) {
    const options = rest[property as OptionCategory];
    if (options && Array.isArray(options)) {
      const optionTotal =
        options.reduce((prev, curr) => {
          return prev + curr.price;
        }, 0) * quantity;

      total = total + optionTotal;
    }
  }

  return total;
};

const formatPrice = (price: number) => {
  const priceArr = price.toString().split("");
  const formattedPriceArr = [];
  let count = 0;
  for (let i = priceArr.length - 1; i >= 0; i--) {
    formattedPriceArr.unshift(priceArr[i]);
    count++;

    if (count % 3 === 0 && count < priceArr.length) {
      formattedPriceArr.unshift(",");
    }
  }

  return formattedPriceArr.join("");
};

export { imgToBase64, formatDate, calculateOptionsTotal, formatPrice };
