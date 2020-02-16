const dotenv = require('dotenv');
const os = require('os');

function getLocalIP() {
  // Network interfaces we want to ignore
  const blacklist = [/VirtualBox/];

  function inBlacklist(key) {
    return blacklist.some((regex) => key.match(regex) !== null);
  }

  const interfaces = os.networkInterfaces();
  let retval;
  Object.keys(interfaces)
    .filter((key) => !inBlacklist(key))
    .some((key) => {
      const ipv4 = interfaces[key].find((address) => address.family === 'IPv4');

      if (ipv4 !== undefined) {
        retval = ipv4.address;
        return true;
      }

      return false;
    });

  return retval;
}

// In production, environment variables come from cloud
// (via now.json and secrets)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

process.env.PORT = parseInt(process.env.PORT, 10) || 3000;
process.env.BACKEND_URL = !process.env.BACKEND_URL
  ? `http://${getLocalIP()}:${process.env.PORT}`
  : process.env.BACKEND_URL;

// Exported values are provided to frontend via transform-define
module.exports = {
  'process.env.BACKEND_URL': process.env.BACKEND_URL,
  'process.env.BUILD_TIMESTAMP': new Date().toString(),
};
