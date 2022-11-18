import create from "zustand";
import { PAYMENTTYPE } from "@prisma/client";

interface CheckoutState {
  phoneNumber: string;
  paymentType: PAYMENTTYPE;
  time: string;
  changePhone: (number: string) => void;
  changePaymentType: (paymentType: PAYMENTTYPE) => void;
  changeTime: (time: string) => void;
}
const useCheckoutStore = create<CheckoutState>(set => ({
  phoneNumber: "",
  paymentType: "VNPAY",
  time: "",
  changePhone: (number: string) => set(state => ({ ...state, phoneNumber: number })),
  changePaymentType: (paymentType: PAYMENTTYPE) => set(state => ({ ...state, paymentType })),
  changeTime: (time: string) => set(state => ({ ...state, time })),
}));

export { useCheckoutStore };
