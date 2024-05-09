const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

app.use(express.json())
const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()
const convertDBObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

app.get('/players', async (req, res) => {
  const getCricketQuery = `select * from cricket_team;`
  const cricketArray = await db.all(getCricketQuery)
  response.send(
    cricketArray.map(eachPlayer => convertDBObjectToResponseObject(eachPlayer)),
  )
})

app.post('/players/', async (req, res) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addPlayerQuery = `insert into cricket_tesm (player_name, jersey_number,role) VALUES
  (
    "${playerName}", ${jerseyNumber},${role}
  );
  `

  const dbResponce = await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (req, res) => {
  const {playerId} = req.params
  const getPlayerQuery = `select * from cricket_team where player_id = ${playerId};`
  const player = await db.get(getPlayerQuery)
  res.send(convertDBObjectToResponseObject(player))
})

app.put('/players/:playerId/', async (req, res) => {
  const {playerId} = req.params
  const playerDetails = req.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `UPDATE cricket_team set player_name = '${playerName}', jersey_number = ${jerseyNumber}, role = '${role}' where player_id =
   ${playerId};`
  await db.run(updatePlayerQuery)
  res.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (req, res) => {
  const {playerId} = req.params
  const deletePlayerQuery = `delete from cricket_team where player_id = ${playerId};`
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
