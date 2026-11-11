'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const fetch = require('src/helpers/fetch')
const IDENTITY_SERVER = process.env.IDENTITY_SERVER || `http://identity-server:3000`
module.exports = async(obj = {}, discordId)=>{
  try{
    console.log(obj?.code)
    console.log(obj?.allyCode)
    if(!discordId || !obj.code || !obj.allyCode) return { status: 'errorOccured' }
    let dObj = (await mongo.find('discordId', {_id: discordId}))[0]
    if(!dObj?.allyCodes || dObj?.allyCodes?.length == 0) return { status: 'errorOccured' }

    if(dObj.allyCodes.filter(x=>x.allyCode == +obj.allyCode).length == 0) return { status: 'errorOccured' }

    let body = { payload: { code: obj?.code, allyCode: +obj.allyCode} }
    let pObj = await fetch(`${IDENTITY_SERVER}/linkGoogle`, { headers: { 'Content-Type': 'application/json'}, timeout: 30000, compress: true, method: 'POST', body: JSON.stringify(body) })
    if(pObj?.error){
      log.error(`${pObj.error}: ${pObj.message}`)
      return { status: 'errorOccured' }
    }
    if(pObj?.body?.status == 406){
      log.error(`${pObj.body.status}: ${pObj.body.message}`)
      return { status: 'allyCodeNoMatch' }
    }
    if(pObj?.body?.status == 405){
      log.error(`${pObj.body.status}: ${pObj.body.message}`)
      return { status: 'code3Error' }
    }
    if(!pObj?.body?.uId){
      if(pObj?.body?.status){
        log.error(`${pObj.body.status}: ${pObj.body.message}`)
      }else{
        log.error(`no uId returned`)
        console.error(pObj)
      }

      return { status: 'errorOccured' }
    }
    await mongo.set('discordId', { _id: discordId, 'allyCodes.allyCode': +obj.allyCode }, { 'allyCodes.$.uId': pObj?.body?.uId, 'allyCodes.$.type': 'google' })

    let tempObj = (await mongo.find('discordId', { _id: discordId }))[0]
    if(!tempObj?.allyCodes) return { status: 'errorOccured' }

    for(let i in tempObj.allyCodes) delete tempObj.allyCodes[i].uId
    return { status: 'linkSuccess', allyCodes: tempObj.allyCodes }
  }catch(e){
    log.error(e)
    return { status: 'errorOccured' }
  }
}
