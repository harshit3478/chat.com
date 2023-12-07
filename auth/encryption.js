const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // Using AES encryption
const key = "slengthmustbeequalto32characters"
const iv = crypto.randomBytes(16);
console.log(key.length)


module.exports = {
    key,
    iv,
    encrypt: function (text) {
      const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
      let encrypted = cipher.update(text, 'utf-8', 'hex');
      encrypted += cipher.final('hex');
      return JSON.stringify({ iv: iv.toString('hex'), encryptedData: encrypted });
    },
    decrypt: function (encryptedString) {
      const data = JSON.parse(encryptedString);
      const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(data.iv, 'hex'));
      let decrypted = decipher.update(data.encryptedData, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');
      return decrypted;
    }
  };