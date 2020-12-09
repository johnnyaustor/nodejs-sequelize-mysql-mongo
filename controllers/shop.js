const Product = require("../models/product");

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchCart = cart;
            return cart.getProducts({ where: { id: productId } })
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(productId);
        })
        .then((product) => {
            return fetchCart.addProduct(product, { through: { quantity: newQuantity } })
        })
        .then(() => {
            res.status(200).json({ "product_id": productId })
        })
        .catch(err => console.error(err))
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.status(200).json({ cart: cart, products: products });
                })
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err))
}

exports.deleteCart = (req, res, next) => {
    const productId = req.body.productId;
    console.log(productId);
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ id: productId });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.status(200).json({ message: 'cart deleted' })
        })
        .catch(err => console.error(err));
}

exports.postOrder = (req, res, next) => {
    let fetchCart;
    req.user.getCart()
        .then(cart => {
            fetchCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity }
                        return product
                    }))
                });
        })
        .then(result => {
            return fetchCart.setProducts(null);
        })
        .then(() => {
            res.status(200).json({ message: 'cart move to order' })
        })
        .catch(err => console.error(err));
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
        .then(orders => {
            res.status(200).json({ orders: orders })
        })
        .catch(err => console.error(err));
}