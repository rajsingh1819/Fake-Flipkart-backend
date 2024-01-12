const express = require('express');
const con = require("../Connection");
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret = 'secretkey';
require("dotenv").config();


router.post("/signup", (req, resp) => {
    data = [req.body.email];
    query = "select name, email, password from user where email=?"
    con.query(query, data, (err, result) => {
        if (!err) {
            if (result.length <= 0) {
                data = [req.body.name, req.body.email, req.body.password];
                //req.body.status, req.body.role
                query = "insert into user(name,email,password,status,role)  values(?,?,?,'true','user')";
                con.query(query, data, (err, result) => {
                    if (!err) {
                        return resp.status(200).json({ message: "Register Successfully !!!" })

                    }
                    else {
                        return resp.status(500).json(err);

                    }
                })
            }
            else {
                return resp.status(400).json({ message: "email already exist !!!" })
            }
        }
        else {
            return resp.status(500).json(err);
        }
    })
})



router.post("/login", (req, resp) => {

    user = req.body;
    data = [user.email, user.password];

    query = "select * from user where email=? && password=?"

    con.query(query, data, (err, result) => {
        if (!err) {

            if (result.length <= 0 || result[0].password != user.password) {
                return resp.status(401).json({ message: "Incorrect Email and Password" });
            }
            else if (result[0].status === "false") {
                return resp.status(401).json({ message: "Wait for Admin approval " })

            }
            else if (result[0].password == user.password) {
                const response = { email: result[0].email, role: result[0].role };
                const accessToken = jwt.sign(response, secret, { expiresIn: '1h' });
                return resp.status(200).json({ token: accessToken, name: result[0].name, role: result[0].role });

            }
            else {
                return resp
                    .status(400)
                    .json({ message: "Somthing went wrong. Please try again later" });
            }


        }
        else {
            return resp.status(500).json(err);
        }
    })

})

router.put("/update/:id", (req, resp) => {
    const data = [req.body.name, req.body.email, req.body.password, req.body.status, req.params.id]
    query = "Update user set name=?, email=?, password=?, status=? where id=?";
    con.query(query, data, (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return resp.status(404).json({ message: "user id does not exist" });
            }
            else {
                return resp
                    .status(200)
                    .json({ message: "User Updated Successfully" });

            }

        }
        else {
            return resp.status(500).json(err);
        }
    })
})

router.delete("/delete/:id", (req, resp) => {
    query = "Delete from user where id =?";
    con.query(query, [req.params.id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return resp.status(404).json({ message: "user id does not exist" });
            }
            else {
                return resp.status(200).json({ message: "Data Delete Successfully !!!" });

            }

        }
        else {
            return resp.status(500).json(err);
        }

    })
})



router.get("/get", (req, resp) => {
    query = "select * from user where role='user'";

    con.query(query, (err, result) => {
        if (!err) {
            // console.log(result);
            return resp.send(result);
        }
        else {
            // console.log(err);
            return resp.status(500).json(err);
        }
    })
})



module.exports = router;