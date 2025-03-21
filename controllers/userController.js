const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const {username, password} = req.body;
    try {
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(404).send({msg: "User exists"});
        } else {
            const encrypted =  await bcrypt.hash(password, 10);
            const user = new User({
                username: username,
                password: encrypted
            });
            await user.save();
        }

        return res.status(201).send({msg: "User created"});
    } catch (err) {
        return res.status(500).send({msg: err.message});
    }
}

const loginUser = async (req, res) => {
    const {username, password} = req.body;
    try {
        const existingUser = await User.findOne({username});
        if (!existingUser) {
            return res.status(404).send({msg: "Invalid credentials"});
        } else {
            const match = await bcrypt.compare(password, existingUser.password);
            if (!match) {
                return res.status(404).send({msg: "Invalid credentials"});
            } else {
                const token = jwt.sign({_id: username.id, username: username}, process.env.JWT_SECRET, {expiresIn: '1d'});
                return res.status(201).send({msg: "User logged in", token});
            }
        }
    } catch {err} {
        return req.send(500).send({msg: err.message});
    }
}

module.exports = {
    registerUser,
    loginUser
}