import express from 'express';
import favIcon from 'serve-favicon';
import path from 'path';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import github from 'octonode';
import Handlebars from 'handlebars';
import HandlebarsIntl from 'handlebars-intl';

HandlebarsIntl.registerWith(Handlebars);

const app = express();
app.use(favIcon(path.join(__dirname, 'public', 'favicon.ico')));

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: './views/layouts/',
    partialsDir: './views/partials/',
});
const followers = [];

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/users/:user', (req, res) => {
    res.render('user');
})

app.post('/', (req, res) => {
    const username = req.body.userId;
    
    const client = github.client({
        id: '54d96e07e3699b7c02a0',
        secret: '69bccfe93bfded69db030e14b7b33ef342f8c113'
    });
    const ghuser = client.user(username);
    ghuser.info((err, data, headers) => {
        if (!data) {
            return res.render('home', {err: err});
        }
        let userData = {
            name: data.name,
            followers: data.followers,
            avatarUrl: data.avatar_url,
            location: data.location,
        }
        let userFollowers = {};
        if (data.followers > 0) {
            ghuser.followers((err, data, headers) => {
                userFollowers = {
                    data: data,
                }
                userData = Object.assign(userData, userFollowers);
                console.log(userData);
                return res.render('home', {userData});
            })
        }
    })
});

app.listen(8000, () => console.log('The App is listening on port 8000!'))