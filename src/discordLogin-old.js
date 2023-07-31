'use strict'
const log = require('logger')
const path = require('path')
const CryptoJS = require('crypto-js')
const fetch = require('./helpers/fetch')

const EncryptDiscordId = async(discordId)=>{
  return await (CryptoJS.AES.encrypt(discordId, process.env.DISCORD_CLIENT_SECRET)).toString()
}
const GetNewIdentity = async(code)=>{
  let tokens = await GetTokenByCode(code)
  if(!tokens || !tokens?.token_type || !tokens?.access_token) return
  let opts = {method: 'GET', headers: {'authorization': `${tokens.token_type} ${tokens.access_token}`, timeout: 30000, compress: true}}
  let identity =  await fetch('https://discord.com/api/users/@me', opts)
  return identity?.body?.id
}
const GetTokenByCode = async(code)=>{
  let body = [
    ['client_id', process.env.DISCORD_CLIENT_ID],
  	['client_secret', process.env.DISCORD_CLIENT_SECRET],
  	['grant_type', 'authorization_code'],
  	['redirect_uri', process.env.DISCORD_REDIRECT_URL],
  	['code', code],
  	['scope', 'identify']
  ]
  let data = new URLSearchParams(body)
  let opts = { headers: { 'Content-Type': 'application/x-www-form-urlencoded', method: 'POST', body: data.toString(), compress: true, timeout: 30000}}
  let res = await fetch('https://discord.com/api/oauth2/token', opts)
  return res?.body
}
module.exports.auth = async(code, state)=>{
  try{
    let discordId = await GetNewIdentity(code)
    return discordId
  }catch(e){
    log.error(e)
  }
}
module.exports.getAuthUrl = async()=>{
  try{
    return `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=https%3A%2F%2Fswgoh.servebeer.net%2FdiscordAuth&response_type=code&scope=identify`
  }catch(e){
    log.error(e)
  }
}
