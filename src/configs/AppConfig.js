const APP_SECRET = process.env.REACT_APP_SECRET || 'kutilthanos';
const APP_API = process.env.REACT_APP_CORE_API;

console.log('core api => ', APP_API);
module.exports = { APP_SECRET, APP_API }