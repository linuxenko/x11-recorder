var fs = require('fs');
var path = require('path');

module.exports = {
  w : 24,
  h : 24,
  offx : 18,
  offy : 20,
  data : fs.readFileSync(path.resolve(__dirname , 'cursor.data'))
};
