import express,{Application} from 'express';

const cors = require('cors');
const path = require('path');
const port = 5000; 

const app:Application = express();
const apiPath = '/api';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    next();
});

const artistRouter:express.Router = require('./application/routes/artist');
const albumRouter:express.Router = require('./application/routes/album');

app.use(`${apiPath}/artist`,artistRouter);
app.use(`${apiPath}/album`,albumRouter);

app.get('',(req,res)=>{
  res.redirect('/api')
})

app.get('/api',(req,res) => {
    res.send('My page');
})

app.get('*',(req,res)=>{
    res.redirect('/api')
})

app.listen(port, () => console.log(`Server started on port ${port}`));
