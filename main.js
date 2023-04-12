const express = require('express')
const app = express()
const basicAuth = require('express-basic-auth')
require('dotenv').config()
const router = express.Router()
const axious = require('axios')

app.use(basicAuth({
    authorizer: (username, password,cb) =>{
        const userMatches = basicAuth.safeCompare(username, process.env.MY_SECRET_USERNAME)
        const passwordMatches = basicAuth.safeCompare(password,process.env.MY_SECRET_PASSWORD)
        if (userMatches & passwordMatches) {
            return cb(null, true)
        } else {
           return cb(null, false) 
        } 
    },
    authorizeAsync:true
}))

app.use((req, res, next)=>{
    const router_id= req.headers['x-router-id']
    const source_system = req.headers['x-source-system']
    if (source_system === process.env.SOURCE_SYSTEM && router_id===process.env.ROUTER_ID) {
        next()
    } else {
        res.sendStatus(401).json({msg:"Unauthorized requests"})
    }
})

app.get('/', (req, res) =>{
    res.status(200).json({status:200,msg:"request sent successfully"})
})

const PORT = 4050

app.listen(PORT, ()=>{
console.log(`server listening on ${PORT} ...`);
})