const jwt = require('jsonwebtoken');
const userRegister = require('../db/signup');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await userRegister.findOne({ _id: verifyUser._id });
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.render('signin');
        console.log(error);
    }

}

module.exports = auth;