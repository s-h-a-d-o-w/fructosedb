const dev = process.env.NODE_ENV !== 'production';

process.env.BACKEND_URL = dev
	? 'http://localhost:3000'
	: 'https://api.example.com';

// Exported values are provided to frontend via transform-define
module.exports = {
	'process.env.BACKEND_URL': process.env.BACKEND_URL,
};
