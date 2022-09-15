const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

//using template engine ejs. other popular template are pug, mustache
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//read http POST data that reads a form input and store it as javascript object 
app.use(bodyParser.urlencoded({ extended: false }));
//support parsing of application/x-www-form-urlencoded post data
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('6321b8dd4fd4ee8b9149bc23')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect(
        'mongodb+srv://AmanSingh:PNqhlcL38BDrFSYC@cluster0.iruwkqn.mongodb.net/shop?retryWrites=true&w=majority'
    )
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Max',
                    email: 'max@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });