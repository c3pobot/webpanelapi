'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const { CleanAllyCodes } = require('src/helpers')

module.exports = async(obj = {}, discordId)=>{
  try{
    let allyCode, dObj, res = {msg: {openAlert: true, type: 'error', msg: 'Error removing allyCode'}}, allyObj
    if(obj.allyCode) allyCode = +(obj.allyCode.toString().trim().replace(/-/g, ''))
    if(discordId) dObj = (await mongo.find('discordId', {_id: discordId}))[0]
    if(dObj){
      res.msg.msg = allyCode+' is not linked to your account'
      if(dObj.allyCodes) allyObj = dObj.allyCodes.find(x=>x.allyCode.toString() == allyCode.toString())
    }
    if(allyObj){
      if(allyObj.type == 'google') mongo.del('tokens', {_id: allyObj.uId})
      if(allyObj.type == 'facebook') mongo.del('facebook', {_id: allyObj.uId})
      if(allyObj.uId) mongo.del('identity', {_id: allyObj.uId})
      await mongo.pull('discordId', {_id: discordId}, {allyCodes: {allyCode: allyCode}})
      await CleanAllyCodes(dObj.allyCodes)
      res.allyCodes = dObj.allyCodes.filter(x=>x.allyCode.toString() !== allyCode.toString())
      res.msg.type = 'success'
      res.msg.msg = allyCode+' was unlinked from your discordId'
    }
    return res
  }catch(e){
    log.error(e)
    return {msg: {openAlert: true, type: 'error', msg: 'Error removing allyCode'}}
  }
}
