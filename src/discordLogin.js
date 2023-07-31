'use strict'
const CryptoJS = require('crypto-js')
const got = require('got')
const EncryptDiscordId = async(discordId)=>{
  return await (CryptoJS.AES.encrypt(discordId, process.env.DISCORD_CLIENT_SECRET)).toString()
}
const GetNewIdentity = async(code)=>{
	let identity
  const tokens = await GetTokenByCode(code)
  if(tokens && tokens.token_type && tokens.access_token) identity = await got('https://discord.com/api/users/@me', {
    method: 'GET',
    responseType: 'json',
    resolveBodyOnly: true,
    headers: {
      authorization: tokens.token_type+' '+tokens.access_token
    }
  })
  if(identity && identity.id) return identity.id
}
const GetTokenByCode = async(code)=>{
  const body = [
    ['client_id', process.env.DISCORD_CLIENT_ID],
  	['client_secret', process.env.DISCORD_CLIENT_SECRET],
  	['grant_type', 'authorization_code'],
  	['redirect_uri', process.env.DISCORD_REDIRECT_URL],
  	['code', code],
  	['scope', 'identify']
  ]
  const data = new URLSearchParams(body)
  const obj = await got('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data.toString(),
    decompress: true,
    responseType: 'json',
    resolveBodyOnly: true
  })
  return obj
}
module.exports.auth = async(code, state)=>{
  try{
    let discordId = await GetNewIdentity(code)
    return discordId
  }catch(e){
    console.error(e)
  }
}
module.exports.getAuthUrl = async()=>{
  try{
    return 'https://discord.com/api/oauth2/authorize?client_id='+process.env.DISCORD_CLIENT_ID+'&redirect_uri=https%3A%2F%2Fswgoh.servebeer.net%2FdiscordAuth&response_type=code&scope=identify'
  }catch(e){
    console.error(e)
  }
}
