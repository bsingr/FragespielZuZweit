import { buildChallenge as _buildChallenge } from './challenge'

const buildGame = () => {
  return {
    challenges: []
  }
}

const buildChallenge = state => (player_ids, questions_limit) => {
  const c = _buildChallenge(player_ids, questions_limit)
  state.challenges.push(c)
  return c
}

const findChallenge = state => player_ids => {
  const challenge = state.challenges.find(c => {
    let isEqual = true;
    c.player_ids.forEach(player_id => {
      isEqual = isEqual && player_ids.indexOf(player_id) > -1
    })
    return isEqual
  })
  if (!challenge) throw new Error(`No challenge for ${player_ids}`)
  return challenge
}

export {
  buildGame,
  buildChallenge,
  findChallenge
}