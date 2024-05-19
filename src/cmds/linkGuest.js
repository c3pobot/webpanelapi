'use strict'
const log = require('logger')
const CryptoJS = require('crypto-js')
const { v5: uuidv5 } = require('uuid')
const GenerateUid = async(deviceId)=>{
  return await uuidv5(deviceId.toLowerCase(), uuidv5.URL)
}
const GenerateDeviceId = async(deviceId)=>{
  return await CryptoJS.MD5(deviceId.toLowerCase()).toString()
}
const EncryptSSAID = async(decrypted_id)=>{
  return await (CryptoJS.AES.encrypt(decrypted_id, process.env.GOOG_CLIENT_SECRET)).toString()
}

module.exports = async(obj = {}, discordId)=>{
  try{
    let dObj, res = {status: 'errorOccured'}, pObj, authObj, identity, ssaid, encrypted_ssaid, uid, allyObj
    if(discordId) dObj = (await mongo.find('discordId', {_id: discordId}))[0]
    if(dObj?.allyCodes?.length > 0){
      if(obj.allyCode){
        allyObj = dObj.allyCodes.find(x=>x.allyCode.toString() === obj.allyCode?.toString())
        if(obj.androidId) ssaid = await GenerateDeviceId(obj.androidId.toString().trim())
        if(ssaid) uid = await GenerateUid(obj.androidId.toString().trim())
      }
      if(ssaid && uid) authObj = await Client.post('authGuest', { uid: ssaid })
      if(authObj?.authToken) identity = {
        auth: {
          authId: authObj.authId,
          authToken: authObj.authToken,
        },
        deviceId: uid,
        androidId: uid,
        platform: 'Android'
      }
      if(identity) pObj = await Client.post('getInitialData', {}, identity)
      if(pObj?.player.allyCode){
        if(pObj.player.allyCode.toString() == obj.allyCode?.toString()){
          encrypted_ssaid = await EncryptSSAID(ssaid)
        }else{
          console.log('Requested '+obj?.allyCode)
          console.log('From Game '+pObj?.player?.allyCode)
          res.status = 'allyCodeNoMatch'
        }
      }
      if(encrypted_ssaid){
        if(allyObj?.type === 'google'){
          await mongo.del('tokens', {_id: allyObj.uId})
          await mongo.del('identity', {_id: allyObj.uId})
        }
        await mongo.set('facebook', {_id: uid}, {ssaid: encrypted_ssaid})
        await mongo.set('identity', {_id: uid}, identity)
        await mongo.set('discordId', {_id: discordId, 'allyCodes.allyCode': +obj.allyCode}, {'allyCodes.$.uId': uid, 'allyCodes.$.type': 'facebook'})
        const tempObj = (await mongo.find('discordId', {_id: discordId}))[0]
        if(tempObj?.allyCodes?.length > 0){
          await HP.CleanAllyCodes(tempObj.allyCodes)
          res.allyCodes = tempObj.allyCodes
        }
        res.status = 'linkSuccess'
      }
    }
    return res
  }catch(e){
    log.error(e)
    return({status: 'errorOccured'})
  }
}
