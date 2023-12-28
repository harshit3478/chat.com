
const bcrypt = require('bcryptjs')
// var salt;
async function genSalt() {
    try {
      const salt = await bcrypt.genSalt(10);
      console.log('salt:', salt);
      return salt;
    } catch (error) {
      console.error('Error generating salt:', error);
      throw error;
    }
  }
  
// just hardcoded it salt  = $2a$10$kIb4bwk/dxcJLRVUvZN2fu
 