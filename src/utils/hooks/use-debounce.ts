import debounce from "lodash.debounce";
import { useRef, useEffect, useMemo } from "react";

export function useDebounce<T extends (...args: any[]) => void>(callback: T) {
  const ref = useRef<(...args: Parameters<T>) => void>(() => {
    console.log("abc");
  });

  useEffect(() => {
    ref.current = callback;
  });

  return useMemo(() => debounce((...args: Parameters<T>) => ref.current(...args), 500), []);
}
