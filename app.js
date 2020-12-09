const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const adminRoute = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

// middleware
app.use(bodyParser.urlencoded());
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.error(err))
})

// route
app.use('/admin', adminRoute);
app.use(shopRoutes);
app.use(errorController.get404);


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
    // .sync({ force: true })
    .sync()
    .then(() => {
        return User.findByPk(1);
    }).then((user) => {
        if (!user) {
            return User.create({ name: 'austor', email: 'austor@jap.com' });
        }
        return user;
    }).then(user => {
        return user.createCart();
    }).then(cart => {
        app.listen(3000);
    })
    .catch(err => console.error(err));