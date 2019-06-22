import {
  buildGame,
  buildChallenge,
  findChallenge
} from '../models/game'

import {
  buildChallengeStats,
  findChallengeQuestion,
  buildChallengeQuestion,
  buildChallengeQuestionAnswer
} from '../models/challenge'

describe('game', () => {
  let game
  beforeEach(() => {
    game = buildGame()
  });

  it('returns game state', () => {
    expect(game).toEqual({
      challenges: []
    });
  });

  it('builds challenge', () => {
    buildChallenge(game)(['greg', 'mike'], 42)
    expect(game).toEqual({
      challenges: [{
        player_ids: ['greg', 'mike'],
        questions: [],
        questions_limit: 42
      }]
    });
  });

  it('builds question in challenge', () => {
    const challenge = buildChallenge(game)(['greg', 'mike'], 11)
    buildChallengeQuestion(challenge)({
      "category": "Entertainment: Film",
      "type": "multiple",
      "difficulty": "easy",
      "question": "What breed of dog was Marley in the film &quot;Marley &amp; Me&quot; (2008)?",
      "correct_answer": "Labrador Retriever",
      "incorrect_answers": [
        "Golden Retriever",
        "Dalmatian",
        "Shiba Inu"
      ]
    })
    expect(game).toEqual({
      challenges: [{
        player_ids: ['greg', 'mike'],
        questions_limit: 11,
        questions: [{
          "category": "Entertainment: Film",
          "type": "multiple",
          "difficulty": "easy",
          "question": "What breed of dog was Marley in the film &quot;Marley &amp; Me&quot; (2008)?",
          "correct_answer": "Labrador Retriever",
          "incorrect_answers": [
            "Golden Retriever",
            "Dalmatian",
            "Shiba Inu"
          ],
          actual_answers: []
        }]
      }]
    });
  });

  it('answers question in challenge until game is finished challenge', () => {
    const challenge = buildChallenge(game)(['greg', 'mike'], 3)
    expect(buildChallengeStats(findChallenge(game)(['greg', 'mike']))).toEqual({
      best_player_ids: ['greg', 'mike'],
      per_player: [
        {
          player_id: 'greg',
          correct_answers: 0,
          incorrect_answers: 0
        },
        {
          player_id: 'mike',
          correct_answers: 0,
          incorrect_answers: 0
        }
      ]
    })
    buildChallengeQuestion(challenge)({
      "category": "Entertainment: Film",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Foo1?",
      "correct_answer": "Bar1",
      "incorrect_answers": [
        "Baz"
      ]
    })
    buildChallengeQuestion(challenge)({
      "category": "Entertainment: Film",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Foo2?",
      "correct_answer": "Bar2",
      "incorrect_answers": [
        "Baz"
      ]
    })
    buildChallengeQuestion(challenge)({
      "category": "Entertainment: Film",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Foo3?",
      "correct_answer": "Bar3",
      "incorrect_answers": [
        "Baz"
      ]
    })
    buildChallengeQuestionAnswer(challenge)("Foo1?")('mike')('Bar1')
    buildChallengeQuestionAnswer(challenge)("Foo2?")('mike')('Baz')
    buildChallengeQuestionAnswer(challenge)("Foo3?")('mike')('Bar3')
    buildChallengeQuestionAnswer(challenge)("Foo1?")('greg')('Bar1')
    buildChallengeQuestionAnswer(challenge)("Foo2?")('greg')('Baz')
    buildChallengeQuestionAnswer(challenge)("Foo3?")('greg')('Baz')
    expect(game).toEqual({
      challenges: [{
        questions_limit: 3,
        player_ids: ['greg', 'mike'],
        questions: [{
          "category": "Entertainment: Film",
          "type": "multiple",
          "difficulty": "easy",
          "question": "Foo1?",
          "correct_answer": "Bar1",
          "incorrect_answers": [
            "Baz"
          ],
          actual_answers: [{
            "answer": "Bar1",
            "player_id": "mike"
          },{
            "answer": "Bar1",
            "player_id": "greg"
          }]
        },{
          "category": "Entertainment: Film",
          "type": "multiple",
          "difficulty": "easy",
          "question": "Foo2?",
          "correct_answer": "Bar2",
          "incorrect_answers": [
            "Baz"
          ],
          actual_answers: [{
            "answer": "Baz",
            "player_id": "mike"
          },{
            "answer": "Baz",
            "player_id": "greg"
          }]
        }, {
          "category": "Entertainment: Film",
          "type": "multiple",
          "difficulty": "easy",
          "question": "Foo3?",
          "correct_answer": "Bar3",
          "incorrect_answers": [
            "Baz"
          ],
          actual_answers: [{
            "answer": "Bar3",
            "player_id": "mike"
          },{
            "answer": "Baz",
            "player_id": "greg"
          }]
        }]
      }]
    });
    expect(buildChallengeStats(findChallenge(game)(['greg', 'mike']))).toEqual({
      best_player_ids: ['mike'],
      per_player: [
        {
          player_id: 'greg',
          correct_answers: 1,
          incorrect_answers: 2
        },
        {
          player_id: 'mike',
          correct_answers: 2,
          incorrect_answers: 1
        }
      ]
    })
  });
});
