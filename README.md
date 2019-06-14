[![Travis Build Status](https://travis-ci.org/s-h-a-d-o-w/fructosedb.svg?branch=master)](https://travis-ci.org/s-h-a-d-o-w/fructosedb)

<p align="center"><img src="./assets/icon.png" width="100px" /></p>

# fructosedb

### Environment Variables

#### Required

- `USDA_KEY` - For accessing USDA REST API
- `MONGODB_PW` - For logging visitors

#### Optional

- `BACKEND_URL` (default: `http://localhost`)
- `PORT` - default: `3000`

### Development

Specify variables in `.env`.

### Production

See `Dockerfile`. And of course secret values on various platforms.
