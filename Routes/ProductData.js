const express = require('express');
const multer = require('multer');
const connection = require('../Connection');
const router = express.Router();
const fs = require('fs');
const path = require('path');
require("dotenv").config();


const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, 'public/images')
    },
    filename: function (req, file, cd) {
        // return cd(null, `${Date.now()}_${file.filename}`)

        cd(null, `image-${Date.now()}_${file.originalname}`)
        // return cd(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))


    }
})
const upload = multer({ storage: storage });

router.post('/post', upload.single('image'), (req, resp) => {
    const query = "insert into products (name,image,price,comment) values (?,?,?,?)"
    const product = req.body;
    const data = [product.name, req.file.filename, product.price, product.comment]
    connection.query(query, data, (err, result) => {
        if (!err) {

            return resp.status(200).json({ message: "Product Submit successfully !!!" })
        }
        else {
            return resp.status(500).json({ error: err })

        }
    })

})

router.get('/get', (req, resp) => {
    const query = "select * from products"

    connection.query(query, (err, result) => {
        if (!err) {
            return resp.status(200).json(result);
        }
        else {
            return resp.status(500).json(err);
        }
    })

})

router.delete("/delete/:id", (req, resp) => {
    const productId = req.params.id;

    connection.query("Select image from products where id=?", [productId], (err, result) => {
        if (err) {
            return resp.status(500).json({ error: err })
        }
        //get the image name from mysql database
        const imageName = result[0].image;
        connection.query("delete from products where id=?", [productId], (err, result) => {
            if (err) {
                return resp.status(500).json({ error: err })

            }
            const imagePath = path.join("public/images", imageName);
            fs.unlink(imagePath, (Unlinkerr) => {
                if (Unlinkerr) {
                    return resp.status(500).json({ error: Unlinkerr })
                }
                return resp.status(200).json({ message: "Product deleted successfully!!!" });


            })
        })


    })


});



router.put("/update/:id", upload.single('image'), (req, res) => {
    const product = req.body;
    const productId = req.params.id;

    connection.query("SELECT image FROM products WHERE id=?", [productId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        const imageName = result[0].image;

        const data = [product.name, req.file.filename, product.price, product.comment, productId];
        connection.query("UPDATE products SET name=?, image=?, price=?, comment=? WHERE id=?", data, (err, result) => {
            if (err) {
                return res.status(500).json({ error: ` Error => ${err}` });
            }

            const imagePath = path.join("public/images", imageName);
            fs.unlink(imagePath, (unlinkErr) => {
                if (unlinkErr) {
                    return res.status(500).json({ error: `unlinkErr =>  ${unlinkErr}` });
                }

                return res.status(200).json({ message: "Update Product successfully!!!" });
            });
        });
    });
});
module.exports = router;