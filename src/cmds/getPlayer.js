'use strict'
const mongo = require('mongoclient')
const { calcRosterStats } = require('statcalc')
const swgohClient = require('src/swgohClient')
const getSecondary = ( stats = [], mod = {} ) => {
  if(!stats || stats?.length == 0) return
  for(let i in stats){
    mod.secondary[stats[i].statId] = stats[i]
    mod[`${stats[i].statId}-value`] = stats[i].value
  }
}
const getMods = (unit = {}, res = []) => {
  let mods = unit?.mods
  if(!mods || mods?.length == 0) return
  for(let i in mods){
    let mod = { unitNameKey: unit.nameKey, unitIcon: unit.icon, unitId: unit.baseId, unitAlignment: unit.alignment, unitGL: unit.isGL, gp: unit.gp, secondary: {} }
    getSecondary(mods[i].secondaryStat, mod)
    res.push({
      ...mods[i],
      ...mod
    })
  }
}
module.exports = async(obj = {}, discordId )=>{
  if(!obj.allyCode) return { msg: { type: 'error', msg: 'No allyCode provided' }}

  let player = await swgohClient('player', { allyCode: obj.allyCode?.toString() })
  if(!player?.allyCode) return { msg: { type: 'error', msg: `Error getting player with allyCode ${obj.allyCode}` }}

  let profile = calcRosterStats(player.rosterUnit)
  if(!profile?.roster) return { msg: { type: 'error', msg: 'Error calculating roster stats...' }}

  let mods = []
  for(let i in profile.roster){
    if(!profile.roster[i] || profile.roster[i]?.combatType == 2) continue
    getMods(profile.roster[i], mods)
  }
  if(!mods || mods?.length == 0) return { msg: { type: 'error', msg: 'Error getting mods...' }}

  player.updated = Date.now()
  return { player: player, mods: mods, roster: profile.roster }
}
