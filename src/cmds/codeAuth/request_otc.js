'use strict'
const postRequest = require('./request')
module.exports = async(obj={}, dId)=>{
  try{
    let tempObj = { status: 'error'}
    console.log(obj)
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
    console.error(e);
  }
}
