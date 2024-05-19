'use strict'
const log = require('logger')
const got = require('got')
module.exports = async(uri, opts = {})=>{
  try{
    return await got(uri, opts)
  }catch(e){
    if(e?.response?.body){
      log.error(e.response.body)
    }else{
      log.error(e)
    }
  }
}
