const buildId = (player_ids) => btoa(player_ids.sort((a,b) => a.localeCompare(b)).join())
const buildUrl = (id) => `http://httprelay.io/mcast/${id}`

function postChallenge(challenge) {
  return fetch(buildUrl(buildId(challenge.player_ids)), {
    method: 'POST',
    body: JSON.stringify(challenge)
  })
  .then(res => res.text())
}

function getChallenge(player_ids) {
  return new Promise((resolve, reject) => {
    fetch(buildUrl(buildId(player_ids)), {
      method: 'GET'
    })
    .then(res => resolve(res.json()))
    setTimeout(() => {
      resolve(undefined)
    }, 500)
  })
}

export {
  getChallenge,
  postChallenge
}