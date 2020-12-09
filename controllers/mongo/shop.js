const Product = require("../../models/mongo/product");

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId).then(product => {
        return req.user.addToCart(product);
    }).then(result => {
        res.status(200).json({ "product_id": productId })
    })
    // let fetchCart;
    // let newQuantity = 1;
    // req.user.getCart()
    //     .then(cart => {
    //         fetchCart = cart;
    //         return cart.getProducts({ where: { id: productId } })
    //     })
    //     .then(products => {
    //         let product;
    //         if (products.length > 0) {
    //             product = products[0];
    //         }

    //         if (product) {
    //             const oldQuantity = product.cartItem.quantity;
    //             newQuantity = oldQuantity + 1;
    //             return product;
    //         }
    //         return Product.findByPk(productId);
    //     })
    //     .then((product) => {
    //         return fetchCart.addProduct(product, { through: { quantity: newQuantity } })
    //     })
    //     .then(() => {
    //         res.status(200).json({ "product_id": productId })
    //     })
    //     .catch(err => console.error(err))
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            res.status(200).json({ products: products });
        })
        .catch(err => console.error(err));

}

exports.deleteCart = (req, res, next) => {
    const { productId } = req.params;
    req.user.deleteCartItem(productId)
        .then(() => {
            res.status(200).json({ message: 'cart deleted' })
        })
        .catch(err => console.error(err));
}

exports.postOrder = (req, res, next) => {
    req.user.addOrder()
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