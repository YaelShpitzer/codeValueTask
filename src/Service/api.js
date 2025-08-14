import data from './data';
export function fetchProductsMock() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
}