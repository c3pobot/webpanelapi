'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const botRequest = require('src/helpers/botRequest')

const CheckGuildAdmin = async(obj = {}, dId)=>{
  let guild, server, usr, auth = false
  if(dId && obj?.id){
    guild = (await mongo.find('guilds', {_id: obj.id}, {sId: 1}))[0]
    if(guild?.sId){
      server = (await mongo.find('discordServer', {_id: guild.sId}, {admin: 1}))[0]
      usr = await botRequest('getGuildMember', { sId: guild.sId, dId: dId })
    }
  }
  let userRoles = usr?.roles.map(x=>x.id)
  if(userRoles?.length > 0){
    if(server?.admin?.some(x=> userRoles.includes(x.id))) auth = true
  }
  return auth
}
const CheckServerAdmin = async(obj = {}, dId)=>{
  let server, usr, auth = 0, guild
  if(dId && obj?.id){
    guild = await botRequest('getGuild', {sId: obj.id})
    server = (await mongo.find('discordServer', {_id: obj.id}, {admin: 1}))[0]
    usr = await botRequest('getGuildMember', { sId: obj.id, dId: dId })
    if(dId === guild?.owner_id) auth = true;
  }
  let userRoles = usr?.roles.map(x=>x.id)
  if(userRoles?.length > 0){
    if(server?.admin?.some(x=> userRoles.includes(x.id))) auth = true
  }
  return auth
}
const CheckGlobalAdmin = async(obj = {}, dId)=>{
  if(dId === process.env.BOT_OWNER_ID) return true
}
const CheckAdmin = async(obj = {}, dId)=>{
  if(obj.type === 'guild') return await CheckGuildAdmin(obj, dId)
  if(obj.type === 'player') return true
  if(obj.type === 'server') return await CheckServerAdmin(obj, dId)
  if(obj.type === 'global') return CheckGlobalAdmin(obj, dId)
}
module.exports = async(obj = {}, dId)=>{
  try{
    if(!obj.type || !obj.id || !dId || !obj.squads) return { msg: { type: 'error', msg: 'Error saving squads' } }

    let auth = await CheckAdmin(obj, dId)
    if(!auth) return { msg: { type: 'error', msg: 'You do not have permission to save '+obj.type+' squads' } }

    if(obj.id === 'player') obj.id = dId
    let squads = obj.squads?.filter(x=>x.change) || []
    if(!squads || squads?.length == 0) return { msg: { type: 'info', msg: 'no changes for '+obj.type+' squads to save' } }

    for(let i in squads){
      squads[i].id = obj.id
      if(squads[i].deleteMe){
        await mongo.del('squadTemplate', { _id: obj.id+'-'+squads[i].nameKey?.toString()?.toLowerCase() })
      }else{
        if(squads[i].change?.oldName) await mongo.del('squadTemplate', { _id: obj.id+'-'+squads[i].change?.oldName?.toString().toLowerCase() })
        delete squads[i].change
        await mongo.set('squadTemplate', { _id: obj.id+'-'+squads[i].nameKey.toString().toLowerCase() }, squads[i])
      }
    }
    let res = { msg: {type: 'success', msg: obj.type+' squads saved successfully'} }
    res.squads = await mongo.find('squadTemplate', { id: obj.id }, { TTL: 0 })
    return res
  }catch(e){
    log.error(e)
    return { msg: {type:'error', msg: 'Error occured' } }
  }
}
