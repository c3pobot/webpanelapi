'use strict'
const mongo = require('mongoclient')
const swgohClient = require('swgohClient')

module.exports = async({ allyCode, playerId }, dId)=>{
  try{
    let dObj = (await mongo.find('discordId', {_id: dId}))[0]
    if(!dObj) return {msg: {openAlert: true, type: 'error', msg: 'You did not provide an allyCode'}}
    let res = 0, guildId, pObj, guild, pId = playerId
    if(!pId){
      pObj = (await mongo.find('playerCache', {allyCode: allyCode}))[0]
      if(!pObj) pObj = await swgohClient('player', {allyCode: allyCode?.toString()})
      if(pObj?.playerId) pId = pObj.playerId
      if(pObj?.guildId) guildId = pObj.guildId
    }
    if(!guildId && !pObj){
      let pObj = await swgohClient('player', {allyCode: allyCode?.toString(), playerId: pId})
      if(pObj.guildId){
        guildId = pObj.guildId
        pId = pObj.playerId
      }
    }
    if(guildId && pId){
      guild = (await mongo.find('guildCache', {_id: guildId}))[0]
      if(!guild){
        const tempGuild = await swgohClient('guild', {guildId: guildId, includeRecentGuildActivityInfo: false})
        if(tempGuild?.guild) guild = tempGuild.guild
      }
    }
    if(guild?.member && pId){
      let member = guild.member.find(x=>x.playerId === pId)
      if(member) res = +member.memberLevel
    }
    return {level: res}
  }catch(e){
    throw(e)
  }
}
