'use strict'
const { v5: uuidv5 } = require('uuid')
const postRequest = require('./request')
const CreateUUid = async(authId)=>{
  try{
    return await uuidv5(authId, uuidv5.URL)
  }catch(e){
    console.error(e);
  }
}
module.exports = async(obj = {}, dId)=>{
  try{
    let res = {status: 'error'}, cacheObj, tempAuth, pObj, identity
    let dObj = (await mongo.find('discordId', {_id: dId}, { allyCodes: 1 }))[0]
    if(obj?.allyCode && dObj?.allyCodes){
      if(dObj.allyCodes.filter(x=>x.allyCode === +obj.allyCode).length === 0){
        res.status = 'nodiscordlink'
        delete obj.code
        delete obj.allyCode
      }
    }
    if(obj.code && obj.allyCode){
      cacheObj = await redis.get('codeAuth-'+obj.allyCode)
      if(!cacheObj) res.status = 'nocache'
    }
    if(cacheObj?.authId && cacheObj?.authToken){
      tempAuth = await postRequest('/auth/code_check', {
        code: obj.code.toString(),
        email: cacheObj.email,
        rememberMe: true
      }, {
        'X-Rpc-Auth-Id': cacheObj.authId,
        'Cookie': 'authToken='+cacheObj.authToken
      })
      if(tempAuth?.authId && tempAuth?.authToken && tempAuth?.refreshToken) tempAuth.deviceId = await CreateUUid(tempAuth.authId)
    }
    if(tempAuth.deviceId) identity = {
      auth: {
        authId: tempAuth.authId,
        authToken: tempAuth.authToken,
      },
      deviceId: tempAuth.deviceId,
      androidId: tempAuth.deviceId,
      platform: 'Android'
    }
    if(identity?.auth) pObj = await Client.post('getInitialData', {}, identity)
    if(pObj?.player?.allyCode){
      res.status = 'allyCodeNoMatch'
      if(pObj?.player?.allyCode?.toString() === obj.allyCode.toString()){
        const encryptedToken = await Client.Google.Encrypt(tempAuth.refreshToken)
        if(encryptedToken){
          res.status = 'success'
          await mongo.set('identity', {_id: identity.deviceId}, identity)
          await mongo.set('tokens', {_id: identity.deviceId}, {refreshToken: encryptedToken})
          await mongo.set('discordId', {_id: dId, 'allyCodes.allyCode': +obj.allyCode}, {'allyCodes.$.uId': tempAuth.deviceId, 'allyCodes.$.type': 'codeAuth'})
        }
      }
    }
    return res
  }catch(e){
    console.error(e);
  }
}
