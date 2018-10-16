// In production, environment variables come from cloud
// (via now.json and secrets)
if(process.env.NODE_ENV !== 'production')
	require('dotenv').config();

const port = parseInt(process.env.PORT, 10) || 3000;

process.env.BACKEND_URL = !process.env.BACKEND_URL
	? `http://localhost:${port}`
	: process.env.BACKEND_URL;

// Exported values are provided to frontend via transform-define
module.exports = {
	'process.env.BACKEND_URL': process.env.BACKEND_URL,
};
