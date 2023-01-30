const express = require("express");
const jwt = require("jsonwebtoken");
const { Memo } = require("../models/Memo");
const { User } = require("../models/User");

const router = express.Router();

router.use("", (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token)
            return res.status(401).json({ message: "Auth failed, No token provided" });
        const bearer = token.split(" ");
        if (bearer.length !== 2)
            return res.status(401).json({ message: "Auth failed, Invalid token format" });
        const decoded = jwt.verify(bearer[1], process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Auth failed, Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Auth failed, Invalid token" });
        } else
            return res.status(401).json({
                message: "Auth failed"
            });
    }
});

router.post("/", async (req, res) => {
    const { date, content } = req.body;
    if (!date || !content)
        return res.status(400).json({ message: "date and content are required" });

    const memo = new Memo({
        date: date,
        content: content
    });
    const login = req.userData.login;
    try {
        const dataMemo = await memo.save();
        const user = await User.findOne({ login: login });
        user.memos.push(dataMemo);
        const data = await user.save();
        res.json(dataMemo);
    } catch (err) {
        res.status(500).send({ message: err });
    }
});

router.get("/", async (req, res) => {
    const login = req.userData.login;
    const user = await User.findOne({ login: login });
    const nbr = req.query.nbr || user.memos.length;
    const dataToSend = user.memos.filter((elem, index) => index < nbr);
    res.json(dataToSend);
});

router.put("/:id", async (req, res) => {
    try {
        const { date, content } = req.body;
        const login = req.userData.login;
        const user = await User.findOne({ login: login });
        const memo = user.memos.id(req.params.id);
        memo.date = date;
        memo.content = content;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const login = req.userData.login;
        const user = await User.findOne({ login: login });
        user.memos.id(req.params.id).remove();
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports.memosRouter = router;
