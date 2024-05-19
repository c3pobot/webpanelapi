'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const swgohClient = require('swgohClient')

module.exports = async(obj = {}, discordId)=>{
  try{
    let dObj = (await mongo.find('discordId', {_id: discordId}))[0]
    if(dObj?.allyCodes?.length > 0){
      if(obj.query && obj.payload) return await swgohClient(obj.query, obj.payload)
    }else{
      return ({msg: {type: 'error', msg: 'Your discord account is not linked to the bot'}})
    }
  }catch(e){
    log.error(e);
    return {msg: {type: 'error', msg: 'Error getting data'}}
  }
}
