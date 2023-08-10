'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const swgohClient = require('swgohClient')
const { NewToken, SaveRefreshToken } = require('googleToken')
module.exports = async(obj = {}, discordId)=>{
  try{
    let dObj, res = {status: 'errorOccured'}, tokens, pObj, authObj, identity
    if(discordId) dObj = (await mongo.find('discordId', {_id: discordId}))[0]
    if(dObj?.allyCodes?.length > 0){
      if(obj.code && obj.allyCode) tokens = await NewToken(obj.code)
      if(tokens?.accessToken && tokens?.uid) authObj = await swgohClient('authGoogle', { oauthToken: tokens.accessToken, guestId: tokens.uid })
      if(authObj?.code == 3) res.status = 'code3Error'
      if(authObj?.authToken) identity = {
        auth: {
          authId: authObj.authId,
          authToken: authObj.authToken,
        },
        deviceId: tokens.uid,
        androidId: tokens.uid,
        platform: 'Android'
      }
      if(identity) pObj = await swgohClient('getInitialData', {}, identity)
      if(pObj?.player?.allyCode){
        if(pObj.player.allyCode.toString() == obj.allyCode?.toString()){
          await SaveRefreshToken(tokens.uid, tokens.refreshToken)
          await mongo.set('identity', {_id: tokens.uid}, identity)
          await mongo.set('discordId', {_id: discordId, 'allyCodes.allyCode': +obj.allyCode}, {'allyCodes.$.uId': tokens.uid, 'allyCodes.$.type': 'google'})
          const tempObj = (await mongo.find('discordId', {_id: discordId}))[0]
          if(tempObj?.allyCodes?.length > 0){
            for(let i in tempObj.allyCodes){
              delete tempObj.allyCodes[i].uId
              delete tempObj.allyCodes[i].playerId
            }
            res.allyCodes = tempObj.allyCodes
          }
          res.status = 'linkSuccess'
        }else{
          log.info('Requested '+obj?.allyCode)
          log.info('From Game '+pObj?.player?.allyCode)
          res.status = 'allyCodeNoMatch'
        }
      }
    }
    return res
  }catch(e){
    log.error(e)
    return({status: 'errorOccured'})
  }
}
