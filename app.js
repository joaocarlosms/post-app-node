const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

//configs
    //sessions
        app.use(session({
            secret: 'testNode',
            resave: true,
            saveUninitialized: true
        }));
        
        app.use(flash());
    
    //middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg')
            next();
        })    

    //bodyParsers
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

    //Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/blogapp').then(() => {
            console.log('database connected');
        }).catch((err) => {
            console.log('database not connected '+err);
        });
        
    //Public (static files)
        app.use(express.static(__dirname +'/public'));

//routes
    app.use('/admin', admin);
//others
const port = 8091;
app.listen(8091, () => {
    console.log('server is running');
})