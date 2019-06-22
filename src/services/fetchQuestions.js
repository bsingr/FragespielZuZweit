// {
//   "response_code": 0,
//   "results": [
//     {
//       "category": "Entertainment: Film",
//       "type": "multiple",
//       "difficulty": "easy",
//       "question": "What breed of dog was Marley in the film &quot;Marley &amp; Me&quot; (2008)?",
//       "correct_answer": "Labrador Retriever",
//       "incorrect_answers": [
//         "Golden Retriever",
//         "Dalmatian",
//         "Shiba Inu"
//       ]
//     },
//     ...
//   ]
// }
function questions (amount = 7) {
  return fetch(`https://opentdb.com/api.php?amount=${amount}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
  .then(res => res.json())
}

export default questions