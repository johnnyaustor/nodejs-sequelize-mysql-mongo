const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { mongoConnect } = require('./utils/mongo');
const User = require('./models/mongo/user');

const adminRoute = require('./routes/mongo/admin');
const shopRoutes = require('./routes/mongo/shop');
const errorController = require('./controllers/error');

// middleware
app.use(bodyParser.urlencoded());
app.use((req, res, next) => {
    User.findById('5fd0faf2af01363d74d12fee')
        .then(user => {
            req.user = new User(user.username, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.error(err));
})

// route
app.use('/admin', adminRoute);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() => {
    // const user = new User('austor', 'austor@jap.com')
    // user.save()
    //     .then(result => {
    //         console.log(result);
    //     })
    //     .catch(err => console.error(err));

    app.listen(3000);
})