'use strict'
const log = require('logger')
const CheckGuildAdmin = async(obj = {}, dId)=>{
  try{
    let guild, server, usr, auth = 0
    if(dId && obj?.id){
      guild = (await mongo.find('guilds', {_id: obj.id}, {sId: 1}))[0]
      if(guild && guild.sId){
        server = (await mongo.find('discordServer', {_id: guild.sId}, {admin: 1}))[0]
        usr = await MSG.GetGuildMember(guild.sId, dId)
      }
    }
    if(server?.admin?.some(x=> usr?.roles.includes(x.id))) auth++;
    return auth
  }catch(e){
    log.error(e);
  }
}
const CheckServerAdmin = async(obj = {}, dId)=>{
  try{
    let server, usr, auth = 0, guild
    if(dId && obj?.id){
      guild = await MSG.GetGuild(obj.id)
      server = (await mongo.find('discordServer', {_id: obj.id}, {admin: 1}))[0]
      usr = await MSG.GetGuildMember(obj.id, dId)
      if(dId == guild?.owner_id) auth++;
    }
    if(server?.admin?.some(x=> usr?.roles?.includes(x.id))) auth++;
    return auth
  }catch(e){
    log.error(e);
  }
}
const CheckGlobalAdmin = async(obj = {}, dId)=>{
  try{
    let auth = 0
    if(dId === process.env.BOT_OWNER_ID) auth++;
    return auth
  }catch(e){
    log.error(e);
  }
}
const CheckAdmin = async(obj = {}, dId)=>{
  if(obj.type === 'guild') return await CheckGuildAdmin(obj, dId)
  if(obj.type === 'player') return 1
  if(obj.type === 'server') return await CheckServerAdmin(obj, dId)
  if(obj.type === 'global') return await CheckGlobalAdmin(obj, dId)
}
module.exports = async(obj = {}, dId)=>{
  try{
    let res = {msg: {type: 'error', msg: 'Error saving squads'}}, auth, squads = []
    if(obj.type && obj.id && dId && obj.squads){
      res = {msg: {type: 'error', msg: 'You do not have permission to save '+obj.type+' squads'}}
      auth = await CheckAdmin(obj, dId)
    }
    if(auth){
      res = {msg: {type: 'info', msg: 'no changes for '+obj.type+' squads to save'}}
      if(obj.id === 'player') obj.id = dId
      squads = obj.squads.filter(x=>x.change)
    }
    if(squads?.length > 0){
      for(let i in squads){
        squads[i].id = obj.id
        if(squads[i].deleteMe){
          await mongo.del('squadTemplate', {_id: obj.id+'-'+squads[i].nameKey?.toString()?.toLowerCase()})
        }else{
          if(squads[i].change?.oldName) await mongo.del('squadTemplate', {_id: obj.id+'-'+squads[i].change?.oldName?.toString().toLowerCase()})
          delete squads[i].change
          await mongo.set('squadTemplate', {_id: obj.id+'-'+squads[i].nameKey.toString().toLowerCase()}, squads[i])
        }
      }
      res.msg = {type: 'success', msg: obj.type+' squads saved successfully'}
      res.squads = await mongo.find('squadTemplate', {id: obj.id}, {TTL: 0})
    }
    return res
  }catch(e){
    log.error(e)
    return ({msg: {type:'error', msg: 'Error occured'}})
  }
}
