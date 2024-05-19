'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const redis = require('redisclient')
const { v4: uuidv4 } = require('uuid')

const { EncryptId } = require('helpers')


module.exports = async(obj={}, dId)=>{
  try{
    let dObj, res = {alert: {type: 'error', msg: 'you do not have Google/Guest auth set up for allyCode '+obj.allyCode}}, sessionId
    let tempObj = (await mongo.find('discordId', {_id: dId}))[0]
    if(tempObj?.allyCodes) dObj = tempObj.allyCodes.find(x=>x.allyCode === +obj.allyCode)
    if(dObj?.uId && dObj.type){
      res.alert.msg = 'Error getting sessionId'
      sessionId = await uuidv4();
    }
    if(sessionId){
      res.sessionId = await EncryptId(sessionId)
    }
    if(res.sessionId){
      const saveStatus = await redis.setTTL(obj.allyCode+'-mods', {id: sessionId}, 600)
      if(saveStatus !== 'OK') delete res.sessionId
      res.alert = null
    }
    return res
  }catch(e){
    log.error(e);
  }
}
