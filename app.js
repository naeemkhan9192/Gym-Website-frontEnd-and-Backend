// importing the important sttup for the this web app
require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const auth = require('./static/middleware/auth');
const port = process.env.PORT || 8080;
const multer = require('multer')

// __________________________________________________ //
// multer for the images to file  from the client side to the server
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './static/upload')
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage })

// __________________________________________________ //

// databases connetion
const signup = require('./static/db/signup');
const contact = require('./static/db/conn');

// __________________________________________________ //

// to connect the body parser properly
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// __________________________________________________ //

// EXPRESS STATTIC FILE STUFF
app.use('/static', express.static('static'));
app.use('/static', express.static(path.join(__dirname, 'static')));

// __________________________________________________ //

// PUG ENFGINE STUFF
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// __________________________________________________ //

// END POINT Home directory
app.get('/', (req, res) => {
    try {
        const token = req.cookies.jwt;
        res.status(200).render('Home', { token });
    } catch (error) {
        res.status(200).render('Home');
    }
});

// End point fot the contact request
app.get('/contact', (req, res) => {
    const token = req.cookies.jwt;
    res.status(200).render('contact', { token });
});

// __________________________________________________ //

// End point for the sign in request
app.get('/signin', (req, res) => {
    token = req.cookies.jwt;
    res.render('signin', { token });
});

// __________________________________________________ //

// End point for the sign up request
app.get('/signup', (req, res) => {
    res.render('signup');
});

// __________________________________________________ //

// End point for the dashboar request
app.get('/dashboard', auth, async (req, res) => {
    userId = req.user._id
    token = req.cookies.jwt;
    const userInfo = await signup.findOne(userId);
    res.render('dashboard', { userInfo, token });
});
// __________________________________________________ //

// End point for the signout request 
app.get('/signout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currtoken) => {
            return currtoken;
        });

        res.clearCookie('jwt');
        await req.user.save();
        res.render('signin');
    } catch (error) {
        res.status(501).send(error);
    }
});

// __________________________________________________ //

// post request to collect data from the client and saving data to data base
app.post('/contact', async (req, res) => {

    try {
        const myData = new contact(req.body);
        myData.save().then(() => {
            res.send("Your dada has been saved to the Database");
        }).catch((error) => {
            res.status(400).send("item was not saved to the data base");
            console.log(error);
        })
    } catch (error) {
        console.log(error);
    }


});
// __________________________________________________ //

// singup code for getting the user information and save it to the database
app.post('/signup', upload.single("profileImage"), async (req, res, next) => {

    try {

        const password = req.body.password;
        const cpassword = req.body.Confirm_password;

        if (password === cpassword) {
            data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password,
                Confirm_password: req.body.Confirm_password,
                image: req.file.filename
            }

            const SignupData = new signup(data);
            const token = await SignupData.generateAuthToken();

            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 3000 * 60),
                httpOnly: true
                // secure:true
            });

            await SignupData.save();

            res.status(200).render('signin');
        }
        else {
            res.send("Password is can't match");
        }

    } catch (error) {
        console.log(error);
    }
    next();
});

// __________________________________________________ //

// End point for the sign in request
app.post('/signin', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userEmail = await signup.findOne({ email });
        console.log(userEmail)
        const token = await userEmail.generateAuthToken();

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 3000 * 3600),
            httpOnly: true,
            // secure:true
        });
        const isMatch = await bcrypt.compare(password, userEmail.password);

        if (isMatch) {
            res.status(201).render('Home', { token });
        }
        else {
            res.send("Your account detail are incorrect");
        }
    } catch (error) {
        res.send(`Error in singin  ${error}`);
    }
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

// __________________________________________________ // 