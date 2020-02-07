const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-53cb9-firebase-adminsdk-q6o9n-40935d81a3.json')
const databaseURL = 'https://fcm-53cb9.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-53cb9/messages:send'
const deviceToken =
  'faolS7L7iKLKgilVkpYj0m:APA91bEEPH0Evbb04tk5Gri6PzIBVozBkR0UlLQHEgITJ9JQmDJF3D3KoQJnoHH6PuKWhkXPDoB-UYfXLmfNpBmQIuyY16jOuCq6vwoUEewEekxS3NvyR6ArpCnYnz2u1mH4lSk7zHEt'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()