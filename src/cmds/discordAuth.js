'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const path = require('path')
const got = require('helpers/got')
const { URLSearchParams } = require('url');

const { CleanAllyCodes, EncryptId } = require('helpers')

const GetNewIdentity = async(code, redirect_uri)=>{
	try{
		let tokens = await GetTokenByCode(code)
	  if(!tokens || !tokens?.token_type || !tokens?.access_token) return
	  let opts = { method: 'GET', headers: {'Authorization': `${tokens.token_type} ${tokens.access_token}`}, decompress: true, responseType: 'json', resolveBodyOnly: true }
    let res = await got('https://discord.com/api/users/@me', opts)
		if(res?.id) return res
  }catch(e){
    log.error(e)
  }
}
const GetTokenByCode = async(code, redirect_uri)=>{
  try{
		const body = [
      ['client_id', process.env.DISCORD_CLIENT_ID],
    	['client_secret', process.env.DISCORD_CLIENT_SECRET],
    	['grant_type', 'authorization_code'],
    	['redirect_uri', (redirect_uri || process.env.DISCORD_REDIRECT_URL)],
    	['code', code],
    	['scope', 'identify']
    ]
    let data = new URLSearchParams(body)
		let opts = { headers: {'Content-Type': 'application/x-www-form-urlencoded'}, method: 'POST', decompress: true, timeout: {request: 30000}, body: data.toString(), responseType: 'json', resolveBodyOnly: true}
	  return await got('https://discord.com/api/oauth2/token', opts)
  }catch(e){
		log.error(e)
  }
}
module.exports = async(obj = {})=>{
  try{
		if(!obj.code) return
		let identity = await GetNewIdentity(obj.code, obj.redirect_uri)
		if(!identity) return
		let res = {}, allyCode, webProfile = {theme: 'dark', rememberMe: true}
		let dObj = (await mongo.find('discordId', {_id: identity.id}))[0]

		//if(!dObj) return({msg: { type: 'error', msg: 'Your discord account is not linked to the bot'}})
		//if(dObj) encryptedId = EncryptId(identity.id)
		let encryptedId = EncryptId(identity.id)
		if(!encryptedId) return
		res.data = {}
		res.encryptedId = encryptedId
		if(dObj?.webProfile) webProfile = dObj.webProfile
		if(identity.name) webProfile.name = identity.name
		if(identity.avatar) webProfile.avatar = 'https://cdn.discordapp.com/avatars/'+identity.id+'/'+identity.avatar+(identity.avatar.startsWith('a_') ? '.gif':'.png')
		if(identity.banner) webProfile.banner = 'https://cdn.discordapp.com/banners/'+identity.id+'/'+identity.banner+(identity.banner.startsWith('a_') ? '.gif':'.png')
		if(identity.locale) webProfile.locale = identity.locale
		res.data.webProfile = webProfile
		if(dObj?.allyCodes?.length > 0){
			await CleanAllyCodes(dObj.allyCodes)
			res.data.allyCodes = dObj.allyCodes
		}
		await mongo.set('discordId', {_id: identity.id}, {webProfile: webProfile})
		return res

  }catch(e){
    log.error(e)
		return {}
  }
}
