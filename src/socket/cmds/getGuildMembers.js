'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const swgohClient = require('swgohClient')

const QueryGuild = async(guildId)=>{
  try{
    let guild = (await mongo.find('guildCache', {_id: guildId}))[0]
    if(!guild){
      let tempGuild = await swgohClient('guild', {guildId: guildId, includeRecentGuildActivityInfo: false} )
      if(tempGuild?.guild?.profile){
        guild = tempGuild.guild
        guild.updated = Date.now()
        guild.id = guild.profile.id
        guild.name = guild.profile.name
      }
    }
    if(guild.member) guild.member = guild.member.filter(x=>x.memberLevel > 1)
    return guild
  }catch(e){
    log.error(e);
  }
}
module.exports = async(socket, data = {}, dId)=>{
  try{
    let guild, members = []
    if(data?.guildId) guild = await QueryGuild(data.guildId)
    if(guild?.member?.length > 0) members = await mongo.find('playerCache', {guildId: data.guildId}, data.projection)
    const getGuildPlayer = async(playerId)=>{
      try{
        let player = members.find(x=>x.playerId === playerId)
        if(!player) player = await swgohClient('player', { playerId: playerId })
        if(player?.allyCode) socket.emit('guildMember', player)
      }catch(e){
        throw(e)
      }
    }
    for(let i in guild?.member) getGuildPlayer(guild.member[i].playerId)
  }catch(e){
    log.error(e);
  }
}
