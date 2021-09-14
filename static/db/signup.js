const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/userRegistration', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});
mongoose.createConnection('mongodb://localhost/userRegistration', {
    autoIndex: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}).then(() => {
    console.log(`connet singup successfully`);
}).catch((e) => {
    console.log(`no connection ${e}`);
})

const signupSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        requierd: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        requierd: true
    },
    Confirm_password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        require: true
    }
    ,
    date: { type: Date, default: Date.now },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
});

signupSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.Confirm_password = await bcrypt.hash(this.Confirm_password, 10);
    }
    next();
});


// generating tokens
signupSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        // consple
        await this.save();
        return token;
    }
    catch (error) {
        console.log(`error occur in signup ${error}`);
    }
}

const signup = mongoose.model('signup', signupSchema);
module.exports = signup;