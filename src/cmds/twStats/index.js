'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const swgohClient = require('src/swgohClient')

const getGuildId = async(allyCode)=>{
  if(!allyCode) return
  let gObj = (await mongo.find('guildIdCache', { allyCode: +allyCode}))[0]
  if(!gObj?.guildId) gObj = await swgohClient('player', { allyCode: allyCode?.toString() })
  return gObj?.guildId
}


module.exports = async(obj = {}, dId)=>{
  let guildId = obj.guildId, allyCode, twData
  if(!guildId){
    let dObj = (await mongo.find('discordId', {_id: dId}))[0]
    if(dObj?.allyCodes?.length > 0) allyCode = dObj.allyCodes[0]?.allyCode
    if(allyCode) guildId = await getGuildId(allyCode)
  }
  if(guildId) twData = await mongo.find('twStats', {guildId: guildId})
  if(twData?.length > 0){
    for(let i in twData){
      twData[i].date = new Date(+twData[i].endTime).toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      })
    }
    return { data: twData }
  }
}
