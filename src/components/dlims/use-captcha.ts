import { useCallback, useEffect, useRef, useState } from "react";

export function useCaptcha() {
  const answer = useRef(2);
  const [question, setQuestion] = useState("1 + 1");

  const refresh = useCallback(() => {
    const left = 1 + Math.floor(Math.random() * 8);
    const right = 1 + Math.floor(Math.random() * 8);
    answer.current = left + right;
    setQuestion(`${left} + ${right}`);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const check = useCallback((value: string) => {
    if (!value.trim()) return false;
    return Number(value) === answer.current;
  }, []);

  return { question, refresh, check };
}
