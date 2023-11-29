import { v4 as uuid } from "uuid";
import Cookie from 'js-cookie'


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
  if(res.ok)
    return data

  else
    throw data
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
  if(res.ok)
    return data

  else
    throw data
}


async function signOut() {
  let res = await fetch(URL + 'authorization/logout', {
    method: "GET",    
    credentials: "include"
  })

  const data = await res.json()
  if(res.ok)
    return data

  else
    throw "Couldnt reach backend"
}

const URL = "http://localhost:8000/"
async function list(record){
  let res = await fetch(URL + record, {
    method: "GET",
    
    credentials: "include"
  })

  const data = await res.json()
  if(res.ok)
    return data

  else
    throw data
}


async function create(record, _data) {
  let res = await fetch(URL + record, {
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

async function get(record, id) {
  let res = await fetch(URL + record + id , {
    method: "GET",
    
    credentials: "include",
  })

  const data = await res.json()
  if(res.ok)
    return data

  else
    throw data
}

async function update(record, id, _data) {
  let res = await fetch(URL + record, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(_data)
  })

  const data = await res.json()
  if(res.ok)
    return data

  else
    throw data
}

async function remove(record, id) {
  let res = await fetch(URL + record, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },    
    credentials: "include",
  })

  const data = await res.json()
  if(res.ok)
    return data

  else
    throw data
}

export { signIn, signUp, list, remove, get, create, update, signOut, refresh, getMe };
