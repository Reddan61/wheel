enum CONFIG_KEYS {
  ATTEMPTS = "attempts",
}

type TOnChangeAttemptsCb = (attempts: number) => void;

const defaultAttempts = 3;

const getAttemptsFromLocalStorage = () => {
  const attemptsFromLocalStorage = Number(
    localStorage.getItem(CONFIG_KEYS.ATTEMPTS) ?? defaultAttempts
  );

  if (isNaN(attemptsFromLocalStorage) || attemptsFromLocalStorage < 0) {
    return 0;
  }

  return attemptsFromLocalStorage;
};

const config = {
  attempts: getAttemptsFromLocalStorage(),
  onChangeAttempts: null as TOnChangeAttemptsCb | null,
};

window.addEventListener("storage", () => {
  setAttempts(getAttemptsFromLocalStorage());
});

export const getAttempts = () => {
  return config.attempts;
};

export const attemptsSubscribe = (cb: TOnChangeAttemptsCb) => {
  config.onChangeAttempts = cb;

  return () => {
    config.onChangeAttempts = null;
  };
};

export const setAttempts = (attempts: number) => {
  const newAttempts = attempts < 0 ? 0 : attempts;
  config.attempts = newAttempts;
  config.onChangeAttempts?.(newAttempts);
  localStorage.setItem(CONFIG_KEYS.ATTEMPTS, String(newAttempts));
};
