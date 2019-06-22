const findChallengeQuestion = challenge => questionText => {
  const question = challenge.questions.find(q => q.question === questionText)
  if (!question) throw new Error(`No question "${questionText}"`)
  return question
}

const buildChallengeQuestion = challenge => question => {
  challenge.questions.push(Object.assign({
    actual_answers: []
  }, question))
}

const isQuestionAnswered = (question, questionText, answer_player_id) => {
  const answer = question.actual_answers.find(a => a.player_id === answer_player_id)
  return typeof answer === 'object'
}

const isQuestionCorrectlyAnswered = (question, questionText, answer_player_id) => {
  const answer = question.actual_answers.find(a => a.player_id === answer_player_id)
  return answer && answer.answer === question.correct_answer
}

const buildChallengeQuestionAnswer = challenge => questionText => answer_player_id => answerText => {
  const question = findChallengeQuestion(challenge)(questionText)
  if (isQuestionAnswered(question, questionText, answer_player_id)) throw new Error(`Question "${questionText}" already answered by ${answer_player_id}`)
  question.actual_answers.push({
    player_id: answer_player_id,
    answer: answerText
  })
}

const buildChallengeStats = challenge => {
  const per_player = challenge.player_ids.map(player_id => {
    return {
      player_id,
      correct_answers: 0,
      incorrect_answers: 0
    }
  })
  challenge.questions.forEach(q => {
    q.actual_answers.forEach(a => {
      const player_stats = per_player.find(p => p.player_id === a.player_id)
      if (q.correct_answer === a.answer) {
        player_stats.correct_answers += 1
      } else {
        player_stats.incorrect_answers += 1
      }
    })
  })
  const best_player_ids = [];
  let best_player_correct_answers = 0;
  per_player.forEach(p => {
    if (p.correct_answers > best_player_correct_answers) {
      best_player_correct_answers = p.correct_answers
    }
  })
  per_player.forEach(p => {
    if (p.correct_answers === best_player_correct_answers) {
      best_player_ids.push(p.player_id)
    }
  })
  return {
    best_player_ids,
    per_player
  }
}

export {
  buildChallengeStats,
  findChallengeQuestion,
  buildChallengeQuestion,
  buildChallengeQuestionAnswer,
  isQuestionAnswered,
  isQuestionCorrectlyAnswered
}