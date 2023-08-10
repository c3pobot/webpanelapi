'use strict'
const log = require('logger')
const mongo = require('mongoclient')

module.exports = async(obj = {}, dId)=>{
  try{
    log.info(dId)
    let dObj = (await mongo.find('discordId', {_id: dId}))[0]
    if(dObj){
      return await mongo.find('units', {}, {portrait: 0, thumbnail: 0})
    }else{
      return({msg: { type: 'error', msg: 'Your discrod account is not linked to the bot'}})
    }
  }catch(e){
    log.error(e)
  }
}
