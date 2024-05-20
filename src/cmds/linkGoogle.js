'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const swgohClient = require('src/swgohClient')
const { NewToken, SaveRefreshToken } = require('src/googleToken')
module.exports = async(obj = {}, discordId)=>{
  try{

    if(!discordId || !obj.code || !obj.allyCode) return { status: 'errorOccured' }
    let dObj = (await mongo.find('discordId', {_id: discordId}))[0]
    if(!dObj?.allyCodes || dObj?.allyCodes?.length == 0) return { status: 'errorOccured' }

    if(dObj.allyCodes.filter(x=>x.allyCode == +obj.allyCode).length == 0) return { status: 'errorOccured' }

    let tokens = await NewToken(obj.code)
    if(!tokens?.accessToken || !tokens?.uid) return { status: 'errorOccured' }

    let authObj = await swgohClient('authGoogle', { oauthToken: tokens.accessToken, guestId: tokens.uid })
    if(authObj?.code == 3) return { status: 'code3Error' }
    if(!authObj?.authId || !authObj?.authToken) return { status: 'errorOccured' }

    let identity = { auth: { authId: authObj.authId, authToken: authObj.authToken }, deviceId: tokens.uid, androidId: tokens.uid, platform: 'Android' }
    let pObj = await swgohClient('getInitialData', {}, identity)
    if(!pObj?.player?.allyCode) return { status: 'errorOccured' }

    if(pObj?.player?.allyCode?.toString() !== obj?.allyCode?.toString()){
      log.error(`Requested: ${obj.allyCode} From Game: ${pObj?.player?.allyCode}`)
      return { status: 'allyCodeNoMatch' }
    }

    await SaveRefreshToken(tokens.uid, tokens.refreshToken)
    await mongo.set('identity', { _id: tokens.uid }, identity)
    await mongo.set('discordId', { _id: discordId, 'allyCodes.allyCode': +obj.allyCode }, { 'allyCodes.$.uId': tokens.uid, 'allyCodes.$.type': 'google' })
    let tempObj = (await mongo.find('discordId', { _id: discordId }))[0]
    if(!tempObj?.allyCodes) return { status: 'errorOccured' }

    for(let i in tempObj.allyCodes) delete tempObj.allyCodes[i].uId
    return { status: 'linkSuccess', allyCodes: tempObj.allyCodes }

  }catch(e){
    log.error(e)
    return { status: 'errorOccured' }
  }
}
