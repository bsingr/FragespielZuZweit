import {
  buildChallenge,
  buildChallengeQuestion,
  buildChallengeQuestionAnswer,
  syncChallenge
} from '../models/challenge'

const uniformChallengeForDiff = challenge => {
  const copyOfChallenge = JSON.parse(JSON.stringify(challenge))
  copyOfChallenge.questions.forEach(q => {
    q.actual_answers = q.actual_answers.sort((a,b) => a.player_id.localeCompare(b.player_id))
  })
  return copyOfChallenge
}

describe('challenge', () => {
  it('syncs question answers', () => {
    const challenge = buildChallenge(['greg', 'mike'], 3)
    buildChallengeQuestion(challenge)({
      "category": "Entertainment: Film",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Foo1?",
      "correct_answer": "Bar1",
      "incorrect_answers": [
        "Baz1",
        "Bazo1"
      ]
    })
    buildChallengeQuestion(challenge)({
      "category": "Entertainment: Film",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Foo2?",
      "correct_answer": "Bar2",
      "incorrect_answers": [
        "Baz2",
        "Bazo2"
      ]
    })
    buildChallengeQuestionAnswer(challenge)("Foo1?")('mike')('Bar1')

    // create a copy and add new answers
    const copyOfChallenge = JSON.parse(JSON.stringify(challenge))
    buildChallengeQuestionAnswer(copyOfChallenge)("Foo1?")('greg')('Baz1')
    buildChallengeQuestionAnswer(copyOfChallenge)("Foo2?")('mike')('Bazo2')

    // create new answers on original
    buildChallengeQuestionAnswer(challenge)("Foo2?")('greg')('Baz2')

    // sync back the new answers
    syncChallenge(challenge, copyOfChallenge)

    // sync forth the new answers
    syncChallenge(copyOfChallenge, challenge)
    
    expect(uniformChallengeForDiff(challenge)).toEqual({
      player_ids: ['greg', 'mike'],
      questions_limit: 3,
      questions: [
        {
          "category": "Entertainment: Film",
          "type": "multiple",
          "difficulty": "easy",
          "question": "Foo1?",
          "correct_answer": "Bar1",
          "incorrect_answers": [
            "Baz1",
            "Bazo1"
          ],
          actual_answers: [
            { player_id: 'greg', answer: 'Baz1' },
            { player_id: 'mike', answer: 'Bar1' }
          ]
        },
        {
          "category": "Entertainment: Film",
          "type": "multiple",
          "difficulty": "easy",
          "question": "Foo2?",
          "correct_answer": "Bar2",
          "incorrect_answers": [
            "Baz2",
            "Bazo2"
          ],
          actual_answers: [
            { player_id: 'greg', answer: 'Baz2' },
            { player_id: 'mike', answer: 'Bazo2' }
          ]
        }
      ]
    });
    expect(uniformChallengeForDiff(copyOfChallenge)).toEqual(uniformChallengeForDiff(challenge))
  });
});
