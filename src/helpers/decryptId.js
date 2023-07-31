'use strict'
const log = require('logger')
const CryptoJS = require('crypto-js')
module.exports = (encrypted_id)=>{
  if(!encrypted_id) return
  return CryptoJS.AES.decrypt(encrypted_id, process.env.DISCORD_CLIENT_SECRET).toString(CryptoJS.enc.Utf8)
}
