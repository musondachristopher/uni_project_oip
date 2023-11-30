const URL = "http://localhost:8000/"

async function signUp(_data) {
  let res = await fetch(URL + 'authorization/registration/', {
    method: "POST",    
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(_data)
  })

  const data = await res.json()
  data
}

async function getMe() {
  let res = await fetch(URL + 'authorization/user/', {
    method: "GET",    
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const data = await res.json()
  return data
}

async function refresh(_data) {
  let res = await fetch(URL + 'authorization/token/refresh', {
    method: "POST",    
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(_data)
  })

  const data = await res.json()
  return data
}

async function signIn(_data) {
  let res = await fetch(URL + 'authorization/login/', {
    method: "POST",    
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(_data)
  })

  const data = await res.json()
  return data
}


async function signOut() {
  let res = await fetch(URL + 'authorization/logout', {
    method: "GET",    
    credentials: "include"
  })

  const data = await res.json()
  return data
}


async function list(uri){
  let res = await fetch(URL + uri, {
    method: "GET",
    credentials: "include"
  })

  const data = await res.json()
  return data
}

async function create(uri, _data) {
  let res = await fetch(URL + uri, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(_data)
  })

  const data = await res.json()
  return data
}

async function get(uri, id) {
  let res = await fetch(URL + uri + id , {
    method: "GET",
    credentials: "include",
  })
  const data = await res.json()
  return data
}

async function update(uri, id, _data) {
  let res = await fetch(URL + uri + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(_data)
  })

  const data = await res.json()
return data
}

async function remove(uri, id) {
  let res = await fetch(URL + uri + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },    
    credentials: "include",
  })

  const data = await res.json()
return data
}

export { signIn, signUp, list, remove, get, create, update, signOut, refresh, getMe };
