const path = require('path');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    console.log("in add product");
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    req.user.createProduct({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user.id
    })
        .then(() => {
            console.log("product created")
            res.status(200).json({ message: 'product created' });
        })
        .catch(err => console.error(err));
}

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        // Product.findAll()
        .then(products => {
            res.status(200).json({ products: products })
        })
        .catch(err => console.error(err));
}

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findByPk(id)
        .then((product) => {
            console.log(product);
            res.status(200).json({ product: product });
        })
        .catch(err => console.error(err))
}

exports.putEditProduct = (req, res, next) => {
    const id = req.params.productId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    req.user.getProducts({ where: { id: id } })
        // Product.findByPk(id)
        .then(products => {
            const p = products[0];
            p.title = title;
            p.price = price;
            p.description = description;
            p.imageUrl = imageUrl;
            return p.save();
        }).then(result => {
            console.log("updated product");
            res.status(200).json({ product: result });
        })
        .catch(err => console.error(err))
}

exports.deleteProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findByPk(id)
        .then(product => {
            return product.destroy();
        })
        .then(() => {
            console.log("Product deleted");
            res.status(200).json({ message: "product deleted" });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "internal service error" });
        })
}