'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const postRequest = require('./request')

module.exports = async(obj={}, dId)=>{
  let tempObj = { status: 'error'}
  if(obj?.payload?.email && obj.allyCode){
    let res = await postRequest('auth/request_otc', obj.payload, {})
    if(res?.authId && res.authToken){
      res.email = obj.payload.email
      res.allyCode = obj.allyCode
      res.dId = dId
      await mongo.set('codeAuthCache', { _id: +obj.allyCode }, res)
      tempObj.status = 'ok'
    }
  }
  return tempObj
}
