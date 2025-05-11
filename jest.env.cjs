/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '.env.local'),
});

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
