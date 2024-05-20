'use strict'
const CryptoJS = require('crypto-js')
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
module.exports = (discordId)=>{
  if(!discordId) return
  return CryptoJS.AES.encrypt(discordId, DISCORD_CLIENT_SECRET).toString()
}
