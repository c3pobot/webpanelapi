'use strict'
const log = require('logger')
module.exports = async(obj = {}, discordId)=>{
  try{
    let dObj, res = {msg: {openAlert: true, type: 'error', msg: 'You did not provide an allyCode'}}, usr, allyCode, pObj, exists
    if(obj.allyCode) allyCode = +(obj.allyCode.toString().trim().replace(/-/g, ''))
    if(discordId) dObj = (await mongo.find('discordId', {_id: discordId}))[0]
    if(!dObj) res.msg.msg = 'You are required to link to the bot thru discord first'
    if(dObj && allyCode){
      if(!dObj.allyCodes) dObj.allyCodes = []
      if(dObj.allyCodes.filter(x=>x.allyCode == allyCode).length > 0){
        res.msg.msg = allyCode+' is already linked to your account'
      }else{
        res.msg.msg = allyCode+' is not a valid allyCode'
        pObj = await Client.post('playerArena', {
            allyCode: allyCode.toString(),
            playerDetailsOnly: true
          })
      }
    }
    if(pObj && pObj.allyCode){
      exists = (await mongo.find('discordId', {'allyCodes.allyCode': allyCode}))[0]
    }
    if(pObj && pObj.allyCode && !exists){
      await mongo.push('discordId', {_id: discordId}, {allyCodes: {allyCode: allyCode, playerId: pObj.playerId, name: pObj.name}})
      dObj.allyCodes.push({allyCode: allyCode, playerId: pObj.playerId, name: pObj.name})
      for(let i in dObj.allyCodes){
        delete dObj.allyCodes[i].uId
        delete dObj.allyCodes[i].playerId
      }
      res.allyCodes = dObj.allyCodes
      res.msg = {openAlert: true, type: 'success', msg: allyCode+' was added'}
    }
    if(exists){
      const auth = await HP.VerifyUnit(pObj.playerId, pObj.rosterUnit.filter(x=>x.relic && x.currentLevel > 50))
      if(auth == 2){
        await mongo.pull('discordId', {'allyCodes.allyCode': allyCode}, {allyCodes:{allyCode: allyCode}})
        await mongo.del('acVerify', {_id: pObj.playerId})
        await mongo.push('discordId', {_id: discordId}, {allyCodes: {allyCode: allyCode, playerId: pObj.playerId, name: pObj.name}})
        dObj.allyCodes.push({allyCode: allyCode, playerId: pObj.playerId, name: pObj.name})
        for(let i in dObj.allyCodes){
          delete dObj.allyCodes[i].uId
          delete dObj.allyCodes[i].playerId
        }
        res.allyCodes = dObj.allyCodes
        res.msg = allyCode+' was added'
      }else{
        const unit = await HP.GetUnitCheck(pObj.rosterUnit.filter(x=>x.relic && x.currentLevel > 50))
        if(unit){
          const baseId = unit.definitionId.split(':')[0]
          const uInfo = await redis.get('un-'+baseId)
          const tempObj = {
            defId: unit.definitionId,
            mods: unit.equippedStatMod,
            verify: 'add'
          }
          if(tempObj.mods.length > 0) tempObj.verify = 'remove'
          await mongo.set('acVerify', {_id: pObj.playerId}, tempObj)
          res.msg.msg = 'allyCode **'+allyCode+'** for player **'+pObj.name+'** is already linked to another discordId.'
          res.verify = []
          res.verify.push({msg: res.msg, id: 1})
          res.verify.push({msg: 'You can verify you have access to this account by **'+tempObj.verify+'ing** a square and a diamond mod '+(tempObj.verify == 'add' ? 'to':'from')+' **'+(uInfo ? uInfo.nameKey:baseId)+'**', id: 2})
          res.verify.push({msg: ' and then running  this command again.', id: 3})
          res.verify.push({msg: '**Note: This verification expires in ~5 minutes**', id: 4})
        }
      }
    }
    return res
  }catch(e){
    log.error(e)
    return {msg: {openAlert: true, type: 'error', msg: 'Error adding allyCode'}}
  }
}
