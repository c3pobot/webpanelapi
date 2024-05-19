'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const redis = require('redisclient')
const swgohClient = require('swgohClient')
const { DecryptId } = require('helpers')

module.exports = async(obj ={}, dId)=>{
  try{
    let dObj, res = {alert: {type: 'error', msg: 'Your session expired'}}, identity, pObj, sessionId, data, sObj
    if(obj.sessionId) sessionId = await DecryptId(obj.sessionId)
    if(sessionId){
      res.alert.msg = ''
      sObj = await redis.get(sessionId)
      if(sObj?.identity) identity = sObj.identity
      if(sObj?.data) pObj = sObj.data
    }
    log.info(pObj?.player?.allyCode)
    log.info(obj.allyCode)
    if(pObj?.player?.allyCode?.toString() === obj.allyCode.toString() && identity?.auth?.authToken){
      data = await swgohClient(obj.method, obj.payload, identity)
      log.info(data)
    }
    if(data && data?.code !== 5){
      res.sessionId = obj.sessionId
      //await redis.setTTL(sessionId, {id: sessionId, identity: identity, update: +sObj?.timeNow, data: pObj}, 43200)
    }
    return res
  }catch(e){
    log.error(e)
  }
}
