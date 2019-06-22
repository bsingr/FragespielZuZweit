import {
  buildChallengeStats,
  findChallengeQuestion,
  buildChallengeQuestion,
  buildChallengeQuestionAnswer
} from '../models/challenge'

const createQuestionAnswer = callback => challenge => questionText => answer_player_id => answerText => {
  buildChallengeQuestionAnswer(challenge)(questionText)(answer_player_id)(answerText)
  callback(challenge)
}

export {
  createQuestionAnswer
}