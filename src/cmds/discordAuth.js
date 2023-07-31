'use strict'
const got = require('got')

const GetNewIdentity = async(code, redirect_uri)=>{
	try{
    let identity
    const tokens = await GetTokenByCode(code, redirect_uri)
    if(tokens && tokens.token_type && tokens.access_token) identity = await got('https://discord.com/api/users/@me', {
      method: 'GET',
      responseType: 'json',
      resolveBodyOnly: true,
      headers: {
        authorization: tokens.token_type+' '+tokens.access_token
      }
    })
    if(identity && identity.id) return identity
  }catch(e){
    console.error(e)
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
  }catch(e){
    console.error(e)
    if(e.response && e.response.body){
      console.error(e.response.body)
    }else{
      console.error(e)
    }
  }
}
module.exports = async(obj = {})=>{
  try{
		let res = {}
    if(obj.code){
      let identity, encryptedId, allyCode, webProfile = {theme: 'dark', rememberMe: true}
      if(obj.theme) webProfile.theme = obj.theme
      identity = await GetNewIdentity(obj.code, obj.redirect_uri)
      if(identity){
				const dObj = (await mongo.find('discordId', {_id: identity.id}))[0]
        if(dObj) encryptedId = await HP.EncryptId(identity.id)
				if(encryptedId){
					res.data = {}
					if(dObj){
						res.encryptedId = encryptedId
						if( dObj.webProfile) webProfile = dObj.webProfile
		        if(identity.name) webProfile.name = identity.name
		        if(identity.avatar) webProfile.avatar = 'https://cdn.discordapp.com/avatars/'+identity.id+'/'+identity.avatar+(identity.avatar.startsWith('a_') ? '.gif':'.png')
		        if(identity.banner) webProfile.banner = 'https://cdn.discordapp.com/banners/'+identity.id+'/'+identity.banner+(identity.banner.startsWith('a_') ? '.gif':'.png')
		        if(identity.locale) webProfile.locale = identity.locale
		        res.data.webProfile = webProfile
		        if(dObj && dObj.allyCodes && dObj.allyCodes.length > 0){
		          await HP.CleanAllyCodes(dObj.allyCodes)
		          res.data.allyCodes = dObj.allyCodes
		        }
		        await mongo.set('discordId', {_id: identity.id}, {webProfile: webProfile})
					}
				}
      }
    }
		return res
  }catch(e){
    console.error(e)
		return {}
  }
}
