import localforage from 'localforage';
import {
  postChallenge,
  getChallenge
} from '../services/remoteChallenge'
import fetchQuestions from '../services/fetchQuestions'
import {
  buildChallengeStats,
  findChallengeQuestion,
  buildChallengeQuestion,
  buildChallengeQuestionAnswer,
  syncChallenge as _syncChallenge
} from '../models/challenge'

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
  return getChallenge(player_ids).then(challenge => {
    if (challenge) {
      console.log('remote challenge', challenge)
      state.challenges.push(challenge)
      return challenge
    } else {
      let challenge
      try {
        challenge = findChallenge(state)(player_ids)
      } catch (e) {
        challenge = buildChallenge(state)(player_ids, questions_limit)
      }
      return fetchQuestions().then(d => {
        d.results.forEach(q => {
          buildChallengeQuestion(challenge)(q)
        })
      }).then(() => {
        return postChallenge(challenge).then(() => {
          return challenge
        })
      })
    }
  })
}

const syncChallenge = challenge => {
  getChallenge(challenge.player_ids).then(remoteChallenge => {
    if (remoteChallenge) {
      _syncChallenge(challenge, remoteChallenge)
    }
    postChallenge(challenge)
  })
}

export {
  loadGame,
  saveGame,
  createChallenge,
  syncChallenge
}
