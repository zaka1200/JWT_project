const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    //recuperation des donnees
    const { login, pwd, pwd2, name } = req.body;

    // verification des donnes
    if (!login || !pwd || !pwd2 || !name)
        return res.status(400).json({ message: 'all fields are required' });
    if (pwd != pwd2)
        return res.status(400).json({ message: 'passwords dont match' });

    let searchUser = await User.findOne({ login: login })
    if (searchUser)
        return res.status(400).json({ message: 'login already exists' });


    const mdpCrypted = await bcrypt.hash(pwd, 10)
    const user = new User({
        login: login,
        name: name,
        pwd: mdpCrypted,
        memos: []
    })
    user.save().then(() => res.status(201).json({ message: 'success' }))
        .catch(err => res.status(500).json({ message: err }))
})

router.post("/login", async (req, res) => {
    const { login, pwd } = req.body
    const findUser = await User.findOne({ login: login })
    if (!findUser)
        return res.status(404).json({ message: 'no user found' });
    const match = await bcrypt.compare(pwd, findUser.pwd)
    if (match) {
        const payload = {
            login: login,
            name: findUser.name
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        return res.json({ message: 'login success', name: findUser.name, token: token });
    }
    res.status(400).json({ message: 'incorrect password' });
})
router.post("/logout", (req, res) => {
    res.json({ message: "User logged out successfully" });
});

module.exports.UserRouter = router;