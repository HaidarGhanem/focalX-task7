const mongoose = require('mongoose')

const ConnectDB = async (URL) =>{
    try {
        await mongoose.connect(URL, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true })
        return console.log('connected to the DataBase')
    } catch (error) {
        return console.log(error)
    }
}

module.exports = ConnectDB
