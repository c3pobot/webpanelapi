'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const { GetMemberGuilds } = require('src/helpers')
const swgohClient = require('src/swgohClient')
let BOT_OWNER_ID = process.env.BOT_OWNER_ID

module.exports = async(obj = {}, discordId)=>{
  try{

    if(!discordId) return { status: { openAlert: true, type:'error', msg: 'Error getting data from the bot' } }

    let dObj = (await mongo.find('discordId', {_id: discordId}))[0]
    if(!dObj?.allyCodes || dObj.allyCodes?.length == 0) return { status: { openAlert: true, type:'error', msg: 'Error getting data from the bot' } }
    if(discordId !== BOT_OWNER_ID){
      let cached = (await mongo.find('webPanelCache', {_id: discordId}))[0]
      if(cached?.updated && !obj.forced){
        let timeNow = Date.now()
        let timeDiff = +timeNow - +cached.updated
        if( timeDiff < 120000) return {status: { openAlert: true, type:'error', msg: 'You have '+Math.floor((120000 - +timeDiff) / 1000)+' seconds until you can refresh again' }}
      }
    }

    let data = { botOwner: false, guilds: [], servers: [] }

    let botGuilds = await GetMemberGuilds(discordId)
    if(discordId == BOT_OWNER_ID) data.botOwner = true
    if(botGuilds?.length > 0){
      for(let i in botGuilds){
        let tempObj = { id: botGuilds[i].id, name: botGuilds[i].name, owner: (botGuilds[i].ownerID === discordId ? true:false), admin: false }
        if(botGuilds[i].roles?.length > 0){
          let guild = (await mongo.find('discordServer', { _id: botGuilds[i].id }, { admin: 1 }))[0]
          if(guild?.admin?.some(x=> botGuilds[i].roles.includes(x.id))) tempObj.admin = true
        }
        data.servers.push(tempObj)
      }
    }
    for(let i in dObj.allyCodes){
      if(!dObj.allyCodes[i].allyCode) continue
      let player = await swgohClient('player', { allyCode: dObj.allyCodes[i].allyCode.toString() })
      if(!player?.guildId) continue
      if(data.guilds.filter(x=>x.id === player.guildId).length > 0) continue
      let gObj = { id: player.guildId, name: player.guildName, admin: false }
      let gameGuild = (await mongo.find('guilds', {_id: player.guildId}, {sId: 1}))[0]
      gObj.admin = ((gameGuild?.sId && data.servers.filter(x=>x.id === gameGuild.sId && x.admin == true).length > 0) ? true:false)
      data.guilds.push(gObj)
    }
    await mongo.set('webPanelCache', {_id: discordId}, {updated: Date.now()})
    return { status: { openAlert: true, type:'success', msg: 'Discord Server data updated' }, data: data }
  }catch(e){
    log.error(e)
    return { status: { openAlert: true, type:'error', msg: 'Error getting data from the bot' } }
  }
}
