'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const swgohClient = require('swgohClient')

module.exports = async(allyCode)=>{
  try{
    let pObj = (await mongo.find('playerCache', {allyCode: allyCode}, {guildId: 1}))[0]
    if(!pObj?.guildId){
      pObj = await swgohClient('player', {allyCode: allyCode?.toString()})
    }
    return pObj?.guildId
  }catch(e){
    log.error(e);
  }
}
