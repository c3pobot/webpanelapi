'use strict'
const CryptoJS = require('crypto-js')
module.exports = async(encrypted_id)=>{
  return await (CryptoJS.AES.decrypt(encrypted_id, process.env.DISCORD_CLIENT_SECRET)).toString(CryptoJS.enc.Utf8)
}
