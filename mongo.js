const mongoose = require('mongoose')
require('dotenv/config')


const url = process.env.MONGO_CONNECT_URL

const name = process.argv[2]
const number = process.argv[3]

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
        name:  name,
        number: number
    })

    person.save().then(result => {
      console.log('person saved!')
    })
} else {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name + " " + person.number)
        })
    })
}