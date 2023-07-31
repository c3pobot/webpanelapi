'use strict'
const sorter = require('json-array-sorter')
module.exports = async()=>{
  try{
    let res = []
    const cmds = await mongo.find('botCmds', {}, { TTL: 0})
    if(cmds?.length > 0) res = cmds
    return res
  }catch(e){
    console.error(e)
    return []
  }
}
