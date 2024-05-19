'use strict'
const log = require('logger')
const mongo = require('mongoclient')
module.exports = async(playerId, roster)=>{
  try{
    let auth = 0
    let vObj = (await mongo.find('acVerify', {_id: playerId}))[0]
    if(vObj){
      const uObj = roster.find(x=>x.definitionId == vObj.defId)
      if(uObj){
        if(vObj.verify == 'add'){
          if(uObj.equippedStatMod.length == 2){
            for(let i in uObj.equippedStatMod){
              if(uObj.equippedStatMod[i].primaryStat.stat.unitStatId == 48 || uObj.equippedStatMod[i].primaryStat.stat.unitStatId == 49) auth++
            }
          }
        }else{
          if(+vObj.mods.length - +uObj.equippedStatMod.length == 2) auth = 2
        }
      }
    }
    return auth
  }catch(e){
    log.error(e)
  }
}
