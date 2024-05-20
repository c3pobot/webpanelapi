'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const Cmds = {}
const CryptoJS = require('crypto-js')

const OauthClientWrapper = require('googletokenwrapper')

const client = new OauthClientWrapper({
  client_id: process.env.GOOG_CLIENT_ID,
  client_secrect: process.env.GOOG_CLIENT_SECRET,
  redirect_uri: process.env.GOOG_REDIRECT_URI,
  cache_client: process.env.OAUTH_CLIENT_CACHE || false,
  logger: log
})
const GetRefreshToken = async(uid)=>{
  try{
    let refreshToken;
    let obj = (await mongo.find('tokens', {_id: uid}))[0]
    if(obj && obj.refreshToken) refreshToken = await Decrypt(obj.refreshToken)
    return refreshToken
  }catch(e){
    throw(e)
  }
}
const Decrypt = (token)=>{
  try{
    return (CryptoJS.AES.decrypt(token, process.env.GOOG_CLIENT_SECRET)).toString(CryptoJS.enc.Utf8)
  }catch(e){
    throw(e)
  }
}
const Encrypt = (token)=>{
  try{
    return (CryptoJS.AES.encrypt(token, process.env.GOOG_CLIENT_SECRET)).toString()
  }catch(e){
    throw(e)
  }
}
Cmds.GetAutUrl = async()=>{
  try{
    return await client.getUrl()
  }catch(e){
    throw(e)
  }
}
Cmds.GetAccessToken = async(uid)=>{
  try{
    let accessToken = await client.getByUid(uid)
    if(!accessToken){
      let refreshToken = await GetRefreshToken(uid)
      if(refreshToken) accessToken = await client.getAccess(uid, refreshToken)
    }
    return accessToken
  }catch(e){
    throw(e)
  }
}
Cmds.SaveRefreshToken = async(uid, refreshToken)=>{
  try{
    let tempObj = {status: 'errorOccured'}
    let encryptedToken = await Encrypt(refreshToken)
    if(encryptedToken){
      await mongo.set('tokens', {_id: uid}, {refreshToken: encryptedToken})
      tempObj.status = 'googleLinkComplete'
    }
    return tempObj
  }catch(e){
    throw(e)
  }
}

Cmds.NewToken = async(code)=>{
  try{
    let uid, accessToken, tempObj
    let tempToken = await client.getTokens(code)
    if(tempToken?.tokens) uid = await client.getUid(tempToken.tokens)
    if(uid && tempToken?.tokens.refresh_token){
      accessToken = await client.newClient(uid, tempToken.tokens.refresh_token)
    }
    if(accessToken) tempObj = {
      refreshToken: tempToken.tokens?.refresh_token,
      accessToken: accessToken,
      uid: uid
    }
    return tempObj
  }catch(e){
    throw(e)
  }
}
Cmds.Decrypt = Decrypt
Cmds.Encrypt = Encrypt
module.exports = Cmds
