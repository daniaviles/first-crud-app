const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb_URL'

MongoClient.connect('mongodb_URL',{ useUnifiedTopology: true })
    .then(client =>{
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        app.set('view engine','ejs')
        app.use(bodyParser.urlencoded({ extended: true}))
        app.use(express.static('public'))
        app.use(bodyParser.json())

        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
                .then(results => {
                    console.log(results)
                    res.render('index.ejs', {quotes: results})
                })
                .catch(error => console.error(error))

        })
        
        app.post('/quotes', (req,res) => {
        quotesCollection.insertOne(req.body)
            .then(result =>{
                res.redirect('/')
            })
            .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res) =>{
            quotesCollection.findOneAndUpdate(
                {name: 'yoda'},
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result =>{
                    console.log(result)
                    res.json('success')
                })
            .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                {name: req.body.name}
            )
            .then(result => {
                if(result.deletedCount === 0){
                    return res.json('No quotes to delete.')
                }
                res.json(`Deleted Darth Vader's quote`)
            })
            .catch(error =>console.error(error))
        })
        
        app.listen(5700,function(){
            console.log('Listening on 5700')
        })
            
    })
    
  .catch(error =>console.error(error))
