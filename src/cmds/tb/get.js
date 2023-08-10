'use strict'
const log = require('logger')
const mongo = require('mongoclient')

module.exports = async(obj={}, dId)=>{
  try{
    if(obj.guildId && obj.collection?.startsWith('tb') && obj.tbId){
      let tempObj = (await mongo.find(obj.collection, {_id: obj.guildId}))[0]
      if(tempObj && tempObj[obj.tbId]) return tempObj[obj.tbId]
    }
  }catch(e){
    log.error(e);
  }
}
