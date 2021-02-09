const port = 3001
require('./app').listen(port, () => {
  console.log(`OctoBay API listening at http://localhost:${port}`)
})
