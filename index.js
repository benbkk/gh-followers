import express from 'express';
import exphbs from 'express-handlebars';

const app = express();
let hbs;

hbs = exphbs.create({
    helpers: {
        foo: () => 'FOO!',
        bar: () => 'BAR!',
    },
    defaultLayout: 'main',
    extname: '.hbs',
});

app.use(express.static('public'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.get('/', (req, res) => res.render('index'));

app.listen(8000, () => console.log('Example app listening on port 8000!'))