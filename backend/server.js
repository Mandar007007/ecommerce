const app = require('./app')
const dotenv = require('dotenv')
const connectDb = require('./config/database')
const cloudinary = require("cloudinary")
dotenv.config({path:"backend/config/config.env"})

connectDb()

cloudinary.config({
    cloud_name:"dxggp2ecx",
    api_key:"755829262882474",
    api_secret:"7T3NB1Xl96OGUiCDLNRX_NuV3p0",
    secure:true
})

app.listen(process.env.PORT,() => {
    console.log('Listning on '+process.env.PORT)
})