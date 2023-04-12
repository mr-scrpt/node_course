'use strict'

const transport = {
  http: 'http://127.0.0.1:8001/',
  ws: 'ws://127.0.0.1:8001/',
}
const url = transport.http
const [protocol] = url.split(':')

const scaffold = (url, structure) => {
  const api = {}
  const [protocol] = url.split(':')
  const services = Object.keys(structure)
  const handler = protocol === 'http' ? HTTPTransport : WSTransport
  for (const serviceName of services) {
    api[serviceName] = {}
    const service = structure[serviceName]
    const methods = Object.keys(service)
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) =>
        handler(url, serviceName, methodName, args)
    }
  }
  return api
}

let wsSocket

const WSTransport = (url, serviceName, methodName, args) => {
  if (!wsSocket) {
    wsSocket = new WebSocket(url)
  }

  return new Promise((resolve) => {
    const packet = { name: serviceName, method: methodName, args }
    wsSocket.send(JSON.stringify(packet))
    wsSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      resolve(data)
    }
  })
}

const HTTPTransport = async (url, serviceName, methodName, args) => {
  const urlRequest = `${url}${serviceName}/${methodName}/${args}`
  try {
    const data = await fetch(urlRequest, {
      method: 'POST',
      body: JSON.stringify(args),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return Promise.resolve(data.json())
  } catch (err) {
    console.log('reject data', err)
    Promise.reject(new Error(`Ошибка ${err}`))
  }
}

const api = scaffold(url, {
  user: {
    create: ['record'],
    read: ['id'],
    update: ['id', 'record'],
    delete: ['id'],
    find: ['mask'],
  },
  country: {
    read: ['id'],
    delete: ['id'],
    find: ['mask'],
  },
})

if (protocol === 'ws') {
  wsSocket = new WebSocket(url)
  console.log('ws start')
  wsSocket.addEventListener('open', async () => {
    const data = await api.user.read(3)
    console.dir({ data })
  })
}
if (protocol === 'http') {
  window.addEventListener('DOMContentLoaded', async () => {
    console.log('http start')
    const data = await api.user.read(3)
    console.dir({ data })
  })
}
// const scaffoldWS = (structure) => {
//   const api = {}
//   const services = Object.keys(structure)
//   for (const serviceName of services) {
//     api[serviceName] = {}
//     const service = structure[serviceName]
//     const methods = Object.keys(service)
//     for (const methodName of methods) {
//       api[serviceName][methodName] = (...args) =>
//         WSTransport(serviceName, methodName, args)
//     }
//   }
//   return api
// }

// const scaffoldHTTP = (structure) => {
//   const api = {}
//   const services = Object.keys(structure)
//   for (const serviceName of services) {
//     api[serviceName] = {}
//     const service = structure[serviceName]
//     const methods = Object.keys(service)
//     for (const methodName of methods) {
//       api[serviceName][methodName] = (...args) =>
//         HTTPTransport(serviceName, methodName, args)
//     }
//   }
//   return api
// }

// const HTTPTransport = async (serviceName, methodName, args) =>
//   new Promise((resolve, reject) => {
//     const url = `http://localhost:8001/${serviceName}/${methodName}/${args}`
//     fetch(url, {
//       method: 'POST',
//       body: JSON.stringify(args),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }).then((response) => {
//       const { status } = response
//       if (status !== 200) {
//         reject(new Error('Ошибка HTTP: ' + status))
//         return
//       }
//       resolve(response.json())
//     })
//   })
// const HTTPTransport = async (serviceName, methodName, args) => {
//   const url = `http://localhost:8001/${serviceName}/${methodName}/${args}`
//   return new Promise(async (resolve, reject) => {
//     try {
//       const data = await fetch(url, {
//         method: 'POST',
//         body: JSON.stringify(args),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//       // console.log('resolve deata', data.json())
//       resolve(data.json())
//     } catch (err) {
//       console.log('reject data', err)
//       reject(new Error(`Ошибка ${err}`))
//     }
//   })
// }
// const apiWS = scaffoldWS({
//   user: {
//     create: ['record'],
//     read: ['id'],
//     update: ['id', 'record'],
//     delete: ['id'],
//     find: ['mask'],
//   },
//   country: {
//     read: ['id'],
//     delete: ['id'],
//     find: ['mask'],
//   },
// })
// socket.addEventListener('open', async () => {
//   const data = await apiWS.user.read(3)
//   console.dir({ data })
// })

// const apiHTTP = scaffoldHTTP({
//   user: {
//     create: ['record'],
//     read: ['id'],
//     update: ['id', 'record'],
//     delete: ['id'],
//     find: ['mask'],
//   },
//   country: {
//     read: ['id'],
//     delete: ['id'],
//     find: ['mask'],
//   },
// })
// window.addEventListener('DOMContentLoaded', async () => {
//   console.log('http start')
//   const data = await apiHTTP.user.read(3)
//   console.dir({ data })
// })
// const api = scaffold(transport.http, {
//   user: {
//     create: ['record'],
//     read: ['id'],
//     update: ['id', 'record'],
//     delete: ['id'],
//     find: ['mask'],
//   },
//   country: {
//     read: ['id'],
//     delete: ['id'],
//     find: ['mask'],
//   },
// })
// window.addEventListener('DOMContentLoaded', async () => {
//   console.log('http start')
//   const data = await api.user.read(3)
//   console.dir({ data })
// })
