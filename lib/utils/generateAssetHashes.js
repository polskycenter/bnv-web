const crypto = require('crypto');
const debug = require('debug')('@polskycenter/bnv-web:utils:generateAssetHashes');
const fs = require('fs');
const path = require('path');
const walk = require('walk');

function hashFile(filename) {
  return crypto.createHash('sha256').update(fs.readFileSync(filename, 'utf8')).digest('base64');
}

function generateAssetHashes(directory, extensions = new Set(['css', 'js'])) {
  debug('begin: %s', directory);

  const hashes = {};

  walk.walkSync(directory, {
    followLinks: false,
    listeners: {
      file: (root, fileStats, next) => {
        const filename = path.join(root, fileStats.name);

        if (!extensions.has(filename.split('.').pop())) {
          return next();
        }

        hashes[`${filename.split('/').slice(-2).join('/')}`] = hashFile(filename);

        return next();
      }
    }
  });

  debug('done: %O', hashes);

  return hashes;
}

module.exports = generateAssetHashes;
