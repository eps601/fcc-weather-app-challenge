const path = require('path')
const express = require('express')

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

const port = process.env.PORT || 3000

app.get('', (req, res) => {
  res.send(console.log('Hello Express'))
})

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})