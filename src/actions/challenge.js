import fetchQuestions from '../services/fetchQuestions'
import {
  buildChallengeStats,
  findChallengeQuestion,
  buildChallengeQuestion,
  buildChallengeQuestionAnswer
} from '../models/challenge'

const createQuestions = (challenge) => {
  return fetchQuestions().then(d => {
    d.results.forEach(q => {
      buildChallengeQuestion(challenge)(q)
    })
  })
}

const createQuestionAnswer = callback => challenge => questionText => answer_player_id => answerText => {
  buildChallengeQuestionAnswer(challenge)(questionText)(answer_player_id)(answerText)
  callback()
}

export {
  createQuestions,
  createQuestionAnswer
}