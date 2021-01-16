import Crypto from 'crypto-js';

export function setUser(userData) {
  let encrypted = encrypt(userData);
  localStorage.setItem("user", encrypted);
}

export function getUser() {
  let encrypted = localStorage.getItem("user");
  if(encrypted) return decrypt(encrypted);
  else return {};
}

function encrypt(data) {
  const object = typeof data === 'object' ? JSON.stringify(data) : data;
  return Crypto.Rabbit.encrypt(object, 'secret').toString();
}

function decrypt(data) {
  const predicate = Crypto.Rabbit.decrypt(data, 'secret').toString();
  return isJSON(predicate) ? JSON.parse(predicate) : predicate;
}

function isJSON(data) {
  try {
    JSON.parse(data);
    return true;
  } catch(err) {
    return false;
  }
}