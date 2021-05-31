const path = require('path');
const rimraf = require('rimraf');

const deleteOupputForder = () => {
  rimraf.sync(path.join(__dirname, '../../src/dist'));
}

deleteOupputForder()
