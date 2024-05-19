'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const { CleanAllyCodes } = require('helpers')

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
      if(allyObj.type){
        mongo.del('tokens', {_id: allyObj.uId})
        mongo.del('facebook', {_id: allyObj.uId})
        mongo.del('identity', {_id: allyObj.uId})
        await mongo.unset('discordId', {_id: discordId, 'allyCodes.allyCode': allyObj.allyCode}, {'allyCodes.$.uId': allyObj.uId, 'allyCodes.$.type': allyObj.type})
        await CleanAllyCodes(dObj.allyCodes)
        for(let i in dObj.allyCodes){
          if(dObj.allyCodes[i].allyCode.toString() === allyCode.toString()){
            delete dObj.allyCodes[i].type
          }
        }
        res.allyCodes = dObj.allyCodes
        res.msg.type = 'success'
        res.msg.msg = allyCode+' Google/Guest Auth was removed'
      }else{
        res.msg.msg = allyCode+' does not have Google or Guest Auth set up'
      }
    }
    return res
  }catch(e){
    log.error(e)
    return {msg: {openAlert: true, type: 'error', msg: 'Error removing allyCode'}}
  }
}
