'use strict'
const CryptoJS = require('crypto-js')
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
module.exports = (encrypted_id)=>{
  if(!encrypted_id) return
  return CryptoJS.AES.decrypt(encrypted_id, DISCORD_CLIENT_SECRET).toString(CryptoJS.enc.Utf8)
}
