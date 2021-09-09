const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/userRegistration', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})
mongoose.createConnection('mongodb://localhost/userRegistration',{
    autoIndex: false,
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:true
}).then(()=>{
    console.log(`connet contact successfully`);
}).catch((e)=>{
    console.log(`no connection ${e}`);
})

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    comment: String,
    date: { type: Date, default: Date.now }
});

const contact = mongoose.model('Contact', contactSchema);
module.exports = contact;
