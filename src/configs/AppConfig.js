const APP_SECRET = process.env.APP_SECRET || 'kutilthanos';
const APP_API = process.env.CORE_API;

console.log('core api => ', APP_API);
module.exports = { APP_SECRET, APP_API }