'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const swgohClient = require('src/swgohClient')
const { GetGuildMemberLevel } = require('src/helpers')
module.exports = async(obj={}, dId)=>{
  if(obj.guildId && obj.collection?.startsWith('tb') && obj.data > 0 && obj.allyCode, obj.tbId){
    let memberLevel = await GetGuildMemberLevel({allyCode: obj.allyCode})
    if(memberLevel?.level < 3) return { type: 'error', msg: 'Only guild leader or officers can save tb platoon configuration' }
    let dObj = (await mongo.find('discordId', {_id: dId}))[0]
    if(dObj?.allyCodes.filter(x=>x.allyCode === +obj.allyCode).length > 0){
      await mongo.set(obj.collection, {_id: obj.guildId}, {[obj.tbId]: {id: obj.tbId, data: obj.data, savedBy: obj.allyCode}})
      const tempObj = (await mongo.find(obj.collection, {_id: obj.guildId}))[0]
      if(tempObj && tempObj[obj.tbId]) return tempObj[obj.tbId]
    }
  }
}
