'use strict'
const mongo = require('mongoclient')
const swgohClient = require('src/swgohClient')

module.exports = async({ allyCode, playerId })=>{
  let res = 0, guildId, guild, pId = playerId
  if(!pId){
    let pObj = (await mongo.find('playerIdCache', { allyCode: +allyCode }))[0]
    if(!pObj) pObj = await swgohClient('player', { allyCode: allyCode?.toString() })
    if(pObj?.playerId) pId = pObj.playerId
    if(pObj?.guildId) guildId = pObj.guildId
  }
  if(pId && !guildId){
    let gObj = (await mongo.find('guildIdCache', { playerId: pId }))[0]
    if(!gObj?.guildId) gObj = await swgohClient('player', { playerId: pId })
    if(gObj?.guildId) guildId = pObj.guildId
  }
  if(guildId && pId){
    guild = (await mongo.find('guildCache', {_id: guildId}))[0]
    if(!guild){
      let tempGuild = await swgohClient('guild', { guildId: guildId, includeRecentGuildActivityInfo: true })
      if(tempGuild?.guild) guild = tempGuild.guild
    }
  }
  if(guild?.member && pId){
    let member = guild.member.find(x=>x.playerId === pId)
    if(member) res = +member.memberLevel
  }
  return { level: res }
}
