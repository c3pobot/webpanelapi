'use strict'
const log = require('logger')
const postRequest = require('./request')
module.exports = async(obj={}, dId)=>{
  try{
    let tempObj = { status: 'error'}
    if(obj?.payload?.email && obj.allyCode){
      const res = await postRequest('/auth/request_otc', obj.payload, {})
      if(res?.authId && res.authToken){
        res.email = obj.payload.email
        res.allyCode = obj.allyCode
        res.dId = dId
        await redis.setTTL('codeAuth-'+obj.allyCode, res)
        tempObj.status = 'ok'
      }
    }
    return tempObj
  }catch(e){
    log.error(e);
  }
}
