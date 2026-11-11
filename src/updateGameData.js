'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const statCalc = require('statcalc')
let gameVersion

const update = async()=>{
  try{
    if(mongo.status()){
      let obj = (await mongo.find('botSettings', {_id: 'gameData'}))[0]
      if(obj?.data && obj?.version && obj.version !== gameVersion){
        let status = statCalc.setGameData(obj.data)
        if(status){
           gameVersion = obj.version
           log.info(`gameData set to version ${gameVersion}`)
        }

      }
    }

    setTimeout(update, 5000)
  }catch(e){
    log.error(e)
    setTimeout(update, 5000)
  }
}
update()
module.exports = ()=>{
  return gameVersion
}
