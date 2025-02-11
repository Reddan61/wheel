import Gift1 from "assets/prizes/gift_1.png";
import Gift2 from "assets/prizes/gift_2.png";
import Gift3 from "assets/prizes/gift_3.png";
import Gift4 from "assets/prizes/gift_4.png";
import Coin from "assets/prizes/coin.png";
import Star from "assets/prizes/star.png";
import { IPrize } from "src/Scenes/MainScene/Wheel/Prize/Prize";

export enum CONFIG_KEYS {
  ATTEMPTS = "attempts",
  PRIZES = "prizes",
  ON_CHANGE_ATTEMPTS_CB = "on_change_attempts_cb",
}

type TOnChangeAttemptsCb = (attempts: number) => void;

const DEFAULT_ATTEMPTS_COUNT = 3;

const getAttemptsFromLocalStorage = () => {
  const attemptsFromLocalStorage = Number(
    localStorage.getItem(CONFIG_KEYS.ATTEMPTS) ?? DEFAULT_ATTEMPTS_COUNT
  );

  if (isNaN(attemptsFromLocalStorage) || attemptsFromLocalStorage < 0) {
    return 0;
  }

  return attemptsFromLocalStorage;
};

const config = {
  [CONFIG_KEYS.ATTEMPTS]: getAttemptsFromLocalStorage(),
  [CONFIG_KEYS.PRIZES]: [
    {
      id: "0",
      text: "x25",
      img: Coin,
      winText: "Монеты",
    },
    {
      id: "1",
      text: "Пусто",
    },
    {
      id: "2",
      text: "x1",
      img: Gift2,
      winText: "Подарок",
    },
    {
      id: "3",
      text: "x1",
      img: Gift3,
      winText: "Подарок",
    },
    {
      id: "4",
      text: "x1",
      img: Gift4,
      winText: "Подарок",
    },
    {
      id: "5",
      text: "Пусто",
    },
    {
      id: "6",
      text: "x1",
      img: Gift1,
      winText: "Подарок",
    },
    {
      id: "7",
      text: "x10",
      img: Star,
      winText: "Звезды",
    },
  ] as IPrize[],
  [CONFIG_KEYS.ON_CHANGE_ATTEMPTS_CB]: null as TOnChangeAttemptsCb | null,
};

type TConfig = typeof config;

window.addEventListener("storage", () => {
  setAttempts(getAttemptsFromLocalStorage());
});

export const getConfigValueByKey = <T extends CONFIG_KEYS>(
  key: T
): TConfig[T] => {
  return config[key];
};

const setAttempts = (attempts: number) => {
  const newAttempts = attempts < 0 ? 0 : attempts;
  config[CONFIG_KEYS.ATTEMPTS] = newAttempts;
  config[CONFIG_KEYS.ON_CHANGE_ATTEMPTS_CB]?.(newAttempts);
  localStorage.setItem(CONFIG_KEYS.ATTEMPTS, String(newAttempts));
};

export const setConfigValueByKey = <T extends CONFIG_KEYS>(
  key: T,
  value: (typeof config)[T]
) => {
  if (key === CONFIG_KEYS.ATTEMPTS) {
    setAttempts(value as TConfig[CONFIG_KEYS.ATTEMPTS]);
    return;
  }

  config[key] = value;
};
