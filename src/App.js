import React, {useState, useEffect, useCallback, useMemo} from 'react';
import logo from './logo.svg';
import './App.css';
import { loadGame, saveGame, createChallenge } from './actions/game'
import { createQuestions, createQuestionAnswer } from './actions/challenge'
import { isQuestionAnswered, isQuestionCorrectlyAnswered, buildChallengeStats } from './models/challenge'

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
} 

function ChallengeQuestion({question, incorrect_answers, correct_answer, handleCreateQuestionAnswer, isAlreadyAnswered, isQuestionCorrectlyAnswered}) {
  const answers = useMemo(() => shuffle(incorrect_answers.concat(correct_answer)), [incorrect_answers, correct_answer]);
  return (
    <div className="ChallengeQuestion">
      <p dangerouslySetInnerHTML={{__html: question}} />
      {isAlreadyAnswered ? (isQuestionCorrectlyAnswered ? "√" : "x") : "?"}
      <ul>
        {answers.map(answer => (
          <li key={answer}
              dangerouslySetInnerHTML={{__html: answer}}
              onClick={() => isAlreadyAnswered ? undefined : handleCreateQuestionAnswer(answer)}
            />
        ))}
      </ul>
    </div>
  )
}

function Challenge({my_player_id, player_ids, questions, handleCreateQuestionAnswer}) {
  const stats = buildChallengeStats({player_ids, questions})
  const myStats = stats.per_player.find(s => s.player_id === my_player_id)
  return (
    <div className="Challenge">
      <h2>{player_ids.join(' vs. ')}</h2>
      <ul>
        <li>Best player(s): {stats.best_player_ids.join(', ')}</li>
        <li>Correct answers: {myStats.correct_answers}</li>
        <li>Incorrect answers: {myStats.incorrect_answers}</li>
      </ul>
      {questions.map(question => (
        <ChallengeQuestion
          key={question.question}
          handleCreateQuestionAnswer={handleCreateQuestionAnswer(question.question)(my_player_id)}
          isAlreadyAnswered={isQuestionAnswered(question, question.question, my_player_id)}
          isQuestionCorrectlyAnswered={isQuestionCorrectlyAnswered(question, question.question, my_player_id)}
          {...question}
          />
      ))}
    </div>
  )
}

function App() {
  const [game, setGame] = useState({});

  const my_player_id = 'greg'

  useEffect(() => {
    loadGame().then(state => {
      console.log(state)
      setGame(state)
    })
  }, []);

  const handleCreateChallenge = useCallback(() => {
    loadGame().then(state => {
      const challenge = createChallenge(state)(['greg', 'mike'])
      createQuestions(challenge).then(() => {
        saveGame(state)
        setGame(Object.assign({}, state))
        console.log(state)
      })
    })
  }, []);

  const reload = () => {
    setGame(Object.assign({}, game))
  }

  return (
    <div className="App">
      <a onClick={handleCreateChallenge}>Create Challenge</a>
      {(game.challenges || []).map(challenge => (
        <Challenge
          key={challenge.player_ids.join('-')}
          my_player_id={my_player_id}
          handleCreateQuestionAnswer={createQuestionAnswer(reload)(challenge)}
          {...challenge}
          />
      ))}
    </div>
  );
}

export default App;
