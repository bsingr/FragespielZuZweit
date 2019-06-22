function create (me) {
  fetch(`http://httprelay.io/link/${amount}`, {
    method: 'GET'
  })
  .then(res => res.json())
}

function get (me, other) {
  fetch(`http://httprelay.io/link/${me}`, {
    method: 'GET'
  })
  .then(res => res.json())
}

export create
export get