export const setValue = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getValue = (key) => {
  const data = localStorage.getItem(key);
  if (data && data !== "undefined") {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return null;
};

export const removeKey = (key) => {
  localStorage.removeItem(key);
};

export const clearAll = () => {
  localStorage.clear();
};
