'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const swgohClient = require('src/swgohClient')

module.exports = async(obj = {}, discordId)=>{
  try{
    if(!obj.query || !obj.payload) return { msg: { type: 'error', msg: 'Error getting data' }}
    let dObj = (await mongo.find('discordId', {_id: discordId}))[0]
    if(!dObj?.allyCodes || dObj?.allyCodes?.length == 0) return { msg: { type: 'error', msg: 'Your discord account is not linked to the bot' } }

    return await swgohClient(obj.query, obj.payload)
  }catch(e){
    log.error(e);
    return { msg: { type: 'error', msg: 'Error getting data' } }
  }
}
