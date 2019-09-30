[![Travis Build Status](https://travis-ci.org/s-h-a-d-o-w/fructosedb.svg?branch=master)](https://travis-ci.org/s-h-a-d-o-w/fructosedb)

<p align="center"><img src="./assets/icon.png" width="100px" /></p>

# fructosedb

### TODO

- Add tooltip on the icon for which foods are recommended and which aren't.

### Environment Variables

#### Required

- `USDA_KEY` - For accessing USDA REST API
- `MONGODB_PW` - For logging visitors

#### Optional

- `PORT` - default: `3000`
- `BACKEND_URL` - Only used for the "server up" notification in the terminal. If not set, `os.networkInterfaces()` is used.

### Development

Specify variables in `.env`.

### Production

Currently deployed using zeit's now. Just use secrets for the env variables above on whatever target platform.
