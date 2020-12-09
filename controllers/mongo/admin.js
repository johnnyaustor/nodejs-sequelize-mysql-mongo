const path = require('path');
const Product = require('../../models/mongo/product');

exports.getAddProduct = (req, res, next) => {
    console.log("in add product");
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
}

exports.postAddProduct = (req, res, next) => {
    console.log("oke");
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const product = new Product(title, price, imageUrl, description, null, req.user._id);

    product.save()
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'product created' });
        })
        .catch(err => console.error(err));

}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.status(200).json({ products: products })
        })
        .catch(err => console.error(err));
}

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
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
    const product = new Product(title, price, imageUrl, description, id);
    return product.save()
        .then(() => {
            res.status(200).json({ message: 'product updated' });
        })
        .catch(err => console.error(err));
}

exports.deleteProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteById(id)
        .then(() => {
            console.log("Product deleted");
            res.status(200).json({ message: "product deleted" });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "internal service error" });
        })
}