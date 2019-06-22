import localforage from 'localforage';

import {
  buildGame,
  buildChallenge,
  findChallenge
} from '../models/game'

const loadGame = () => {
  return localforage.getItem('game').then((value) => {
    return value ? JSON.parse(value) : buildGame()
  })
}

const saveGame = (state) => {
  return localforage.setItem('game', JSON.stringify(state))
}

const createChallenge = (state) => (player_ids, questions_limit = 42) => {
  let challenge
  try {
    challenge = findChallenge(state)(player_ids)
  } catch (e) {
    challenge = buildChallenge(state)(player_ids, questions_limit)
  }
  return challenge
}

export {
  loadGame,
  saveGame,
  createChallenge
}
