import Crypto from 'crypto-js';
import { APP_SECRET } from '../configs/AppConfig';

export function setUser(userData) {
  let encrypted = encrypt(userData);
  localStorage.setItem("user", encrypted);
}

export function getUser() {
  let encrypted = localStorage.getItem("user");
  if (encrypted) return decrypt(encrypted);
  else return {};
}

function encrypt(data) {
  const object = typeof data === 'object' ? JSON.stringify(data) : data;
  return Crypto.Rabbit.encrypt(object, APP_SECRET).toString();
}

function decrypt(data) {
  try {
    const predicate = Crypto.Rabbit.decrypt(data, APP_SECRET).toString(Crypto.enc.Utf8);
    return isJSON(predicate) ? JSON.parse(predicate) : predicate;
  } catch(err) {
    return {}
  }
}

function isJSON(data) {
  try {
    JSON.parse(data);
    return true;
  } catch(err) {
    return false;
  }
}