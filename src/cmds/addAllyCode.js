'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const swgohClient = require('src/swgohClient')
const { GetUnitCheck, VerifyUnit } = require('src/helpers')

module.exports = async(obj = {}, discordId)=>{
  try{

    let allyCode = +(obj?.allyCode?.toString()?.trim()?.replace(/-/g, '') || 0)
    if(!allyCode) return { msg: { openAlert: true, type: 'error', msg: 'You did not provide an allyCode' } }

    let dObj = (await mongo.find('discordId', {_id: discordId}))[0] || {}
    if(!dObj.allyCodes) dObj.allyCodes = []
    if(dObj.allyCodes.filter(x=>x.allyCode === allyCode)) return { msg: { openAlert: true, type: 'error', msg: `${allyCode} is already linked to your account` } }

    let pObj = await swgohClient('player', { allyCode: allyCode.toString() })
    if(!pObj?.playerId) return { msg: { openAlert: true, type: 'error', msg: `${allyCode} is not a valid allyCode` } }

    let exists = (await mongo.find('discordId', {'allyCodes.allyCode': allyCode}))[0]

    if(!exists){
      await mongo.push('discordId', { _id: discordId }, { allyCodes: { allyCode: +allyCode, playerId: pObj.playerId, name: pObj.name } })
      dObj.allyCodes.push({ allyCode: +allyCode, playerId: pObj.playerId, name: pObj.name })
      for(let i in dObj.allyCodes) delete dObj.allyCodes[i].uId
      return { msg: { openAlert: true, type: 'success', msg: allyCode+' was added' }, allyCodes: dObj.allyCodes }
    }

    let auth = await VerifyUnit(pObj.playerId, pObj.rosterUnit.filter(x=>x.relic && x.currentLevel > 50))
    if(auth == 2){
      await mongo.pull('discordId', { 'allyCodes.allyCode': allyCode }, { allyCodes: { allyCode: +allyCode } })
      await mongo.del('acVerify', {_id: pObj.playerId})
      await mongo.push('discordId', {_id: discordId}, { allyCodes: { allyCode: +allyCode, playerId: pObj.playerId, name: pObj.name } })
      dObj.allyCodes.push({ allyCode: +allyCode, playerId: pObj.playerId, name: pObj.name })
      for(let i in dObj.allyCodes) delete dObj.allyCodes[i].uId
      return { msg: { openAlert: true, type: 'success', msg: allyCode+' was added' }, allyCodes: dObj.allyCodes }
    }

    let unit = await GetUnitCheck(pObj.rosterUnit.filter(x=>x.relic && x.currentLevel > 50))
    if(!unit) return { msg: { openAlert: true, type: 'success', msg: `${allyCode} is already linked to another discordId and I was unable to create a unit check` } }

    let baseId = unit.definitionId.split(':')[0]
    let uInfo = (await mongo.find('units', {_id: baseId}, {nameKey: 1}))[0]
    let tempObj = { defId: unit.definitionId, mods: unit.equippedStatMod, verify: 'add' }
    if(tempObj.mods.length > 0) tempObj.verify = 'remove'
    await mongo.set('acVerify', {_id: pObj.playerId}, tempObj)
    let res = { msg: {openAlert: true, type: 'error', msg: allyCode+' linked to another discordId'} }
    res.verify = 'allyCode **'+allyCode+'** for player **'+pObj.name+'** is already linked to another discordId.\n\n'
    res.verify += 'You can verify you have access to this account by **'+tempObj.verify+'ing** a square and a diamond mod '+(tempObj.verify == 'add' ? 'to':'from')+' **'+(uInfo ? uInfo.nameKey:baseId)+'**'
    res.verify += ' and then running  this command again.'
    res.verify += '\n**Note: This verification expires in ~5 minutes**'
    return res
  }catch(e){
    log.error(e)
    return { msg: { openAlert: true, type: 'error', msg: 'Error adding allyCode' } }
  }
}
