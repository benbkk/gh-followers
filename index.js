import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import github from 'octonode';
import octoKit from '@octokit/rest'



const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.get('/', (req, res) => res.render('home', {
    followers: null,
    error: null,
}));

app.post('/', (req, res) => {
    const client = github.client({
        id: '54d96e07e3699b7c02a0',
        secret: '69bccfe93bfded69db030e14b7b33ef342f8c113'
    });
    let inputUser = req.body.user;
    const ghuser = client.user(inputUser);
    console.log(ghuser);
    client.get(`/users/${inputUser}`, {}, (err, status, body, headers) => {
        if (body.followers !== 0) {
            console.log(ghuser.followers({
                per_page: 100
            }, (err, data, headers) => {
                console.log('error: ', err);
                console.log('data: ', data);
                console.log('headers: ', headers);
                res.render('home', {data: body, followers: data.map(item => item.login)});
            }));
            
        }
        // const searchedUser = body;
        //json object
    });
    
});



app.listen(8000, () => console.log('The App is listening on port 8000!'));