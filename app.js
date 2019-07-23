const express = require('express');
      path = require('path');
      bodyParser = require('body-parser');
      cons = require('consolidate');
      dust = require('dustjs-helpers');
      app = express();
      pg = require('pg');

//DB Connect String
const PORT = process.env.PORT || 3001;
const connect = 'postgres://postgres:postgres@localhost/recipedb';

// Engine
app.engine('dust', cons.dust);

//Set Default ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect
const client = new pg.Client(connect);
client.connect();

app.get('/', (req, res) => {
  client.query('SELECT * FROM recipes', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    res.render('index', {recipes: result.rows});
  });
});

app.post('/add', function (req, res) {
    client.query('INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)',
      [req.body.name, req.body.ingredients, req.body.directions]);
    res.redirect('/');
/*  });*/
});

app.post('/edit/', (req, res) => {
  client.query('UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4',
    [req.body.name, req.body.ingredients, req.body.directions, req.body.id]);
  res.redirect('/');
});

app.delete('/delete/:id',(req, res) => {
    client.query('DELETE FROM recipes WHERE id = $1',
      [req.params.id]);
    res.send(200);
});

// Server
app.listen(PORT, function () {
    console.log(`Server ${PORT} port`)
});
