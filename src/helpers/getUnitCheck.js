'use strict'
const log = require('logger')
module.exports = async(roster)=>{
  try{
    let returnUnit, tempRoster
    if(roster.filter(x=>x.equippedStatMod.length == 0).length > 0) tempRoster = roster.filter(x=>x.equippedStatMod.length == 0)
    if(!tempRoster && roster.filter(x=>x.currentTier < 10 && x.equippedStatMod.length == 6).length > 0) tempRoster = roster.filter(x=>x.currentTier < 10 && x.equippedStatMod.length == 6)
    if(!tempRoster) tempRoster = roster.filter(x=>x.equippedStatMod.length == 6)
    if(tempRoster && tempRoster.length > 0){
      const randomIndex = Math.floor(Math.random() * ((+tempRoster.length - 1) - 0 + 1)) + 0
      if(tempRoster[randomIndex]) returnUnit = tempRoster[randomIndex]
    }
    return returnUnit
  }catch(e){
    log.error(e)
  }
}
