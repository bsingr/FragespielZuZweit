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
  return (
    <div className="Challenge">
      <h2>{player_ids.join(' vs. ')}</h2>
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

function ChallengeStats({my_player_id, player_ids, questions}) {
  const stats = buildChallengeStats({player_ids, questions})
  const myStats = stats.per_player.find(s => s.player_id === my_player_id)
  return (
    <ul>
      <li>Best player(s): {stats.best_player_ids.join(', ')}</li>
      <li>Correct answers: {myStats.correct_answers}</li>
      <li>Incorrect answers: {myStats.incorrect_answers}</li>
    </ul>
  )
}

function makeId(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function App() {
  const [game, setGame] = useState({});
  const [myPlayerId, setMyPlayerId] = useState(makeId(10))
  const [opponentPlayerId, setOpponentPlayerId] = useState(makeId(10))

  useEffect(() => {
    loadGame().then(state => {
      setGame(state)
    })
  }, []);

  const handleCreateChallenge = useCallback(() => {
    loadGame().then(state => {
      const challenge = createChallenge(state)([myPlayerId, opponentPlayerId])
      createQuestions(challenge).then(() => {
        // saveGame(state)
        setGame(Object.assign({}, state))
      })
    })
  }, []);

  const handleChangeMyPlayerId = (e) => {
    setMyPlayerId(e.target.value)
  }

  const handleChangeOpponentPlayerId = (e) => {
    setOpponentPlayerId(e.target.value)
  }

  const reload = () => {
    setGame(Object.assign({}, game))
  }

  const [currentChallenge, setCurrentChallenge] = useState(undefined);
  const handleStartChallenge = (challenge) => {
    setCurrentChallenge(challenge)
  }
  const handleStopChallenge = () => {
    setCurrentChallenge(undefined)
  }

  let challenges;
  if (currentChallenge) {
    challenges = (
      <div>
        <a onClick={handleStopChallenge}>Stop</a>
        <ChallengeStats my_player_id={myPlayerId} {...currentChallenge} />
        <Challenge
            key={currentChallenge.player_ids.join('-')}
            my_player_id={myPlayerId}
            handleCreateQuestionAnswer={createQuestionAnswer(reload)(currentChallenge)}
            {...currentChallenge}
            />
      </div>
    )
  } else {
    challenges = (
      <ul>
      {(game.challenges || []).map(challenge => (
        <li key={challenge.player_ids.join('-')} onClick={() => handleStartChallenge(challenge)}>
          {challenge.player_ids.join(' vs. ')}
          <ChallengeStats my_player_id={myPlayerId} {...challenge} />
        </li>
      ))}
      </ul>
    )
  }

  return (
    <div className="App">
      Me <input value={myPlayerId} onChange={handleChangeMyPlayerId} />
      vs. 
      Opponent <input value={opponentPlayerId} onChange={handleChangeOpponentPlayerId} />
      <a onClick={handleCreateChallenge}>Create Challenge</a>
      {challenges}
    </div>
  );
}

export default App;
