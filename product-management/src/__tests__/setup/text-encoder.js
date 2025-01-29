// Setup TextEncoder/TextDecoder for tests
const util = require('util');
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;