'use strict'
const CryptoJS = require('crypto-js')
module.exports = (discordId)=>{
  if(!discordId) return
  return CryptoJS.AES.encrypt(discordId, process.env.DISCORD_CLIENT_SECRET).toString()
}
