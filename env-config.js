const dotenv = require('dotenv');
const ip = require('ip');

// In production, environment variables come from cloud
// (via now.json and secrets)
if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

process.env.PORT = parseInt(process.env.PORT, 10) || 3000;
process.env.BACKEND_URL = !process.env.BACKEND_URL
	? `http://${ip.address()}:${process.env.PORT}`
	: process.env.BACKEND_URL;

console.log(process.env.BACKEND_URL);

// Exported values are provided to frontend via transform-define
module.exports = {
	'process.env.BACKEND_URL': process.env.BACKEND_URL,
	'process.env.BUILD_TIMESTAMP': new Date().toString(),
};
