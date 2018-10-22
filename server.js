var express = require('express');
var pgp =require('pg-promise')();
var db = pgp('postgres://ahxdfxkfgsaqis:548016ebe41fd7a414af39170d5e3455aba9eab191f150bf9055d3e3f54723a8@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d9iij409sspnat?ssl=true')
var app = express();
const { Client } =require('pg') 
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
var moment = require('moment');
moment().format();

const client = new Client({
    host : "localhost",
    user : "root",
    password: "root",
    database: "argon_test",
    port: 5432
});
//connect to the database
client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


// create a get request that fetches data from database
app.get('/index', function(req, res) {
    var queryString = 'SELECT * FROM repository ORDER BY NODES ASC';
    client.query(queryString, function (err, qres) {
        if (err) {
            throw err;
        }
        return res.json(qres);
    });
    //this can be used to end the mysql connection
    // connection.end();
});

//enable cross-domain request.
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
app.use(allowCrossDomain);
app.use(express.static(__dirname + "/public"));
//run the server on a particular port
app.listen(3000, function() {
    console.log("Server listening on port 3000");
});

//app.get('/test', function (request, respone) {
//  //  respone.send('<H1>test</H1>');
//});

//app.use(express.static('static'));
app.set('view engine','ejs'); //เอา ejs สร้างให้มัน

app.get('/index', function (req, res) {
     res.render('pages/index');
 });

 app.get('/about', function (req, res) {
     var name = 'Natthawarapon T.';
     var hobbies = ['Music','Movie','Programming'];
     var bdate ='27/06/1997';
    res.render('pages/about',{ fullname : name , hobbies : hobbies,bdate : bdate });
});

app.get('/products', function (req, res) {
    //res.download('./static/index.html');
    //res.redirect('/about'); var pgp =require('pg-promise');
    var product_id = req.param('product_id');
    var sql = 'select * from products';
    if (product_id) {
        sql += ' where product_id ='+product_id+' order by product_id ASC'; 
        }
    db.any(sql+ ' order by product_id ASC')
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/products',{products:data})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })

});

app.get('/products/:product_id', function (req, res) {
 var product_id = req.params.product_id;
 var times = moment().format('MMMM Do YYYY, h:mm:ss a');
 var sql ="select * from products where product_id = "+ product_id;
        
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/product_edit',{product:data[0],time :times})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })
});


app.get('/users/:users_id', function (req, res) {
    var users_id = req.params.users_id;
    var times = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from users where users_id ="+ users_id;
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/users_edit',{users:data[0],time:times})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })
});
//user
app.get('/users', function (req, res) {
    //res.download('./static/index.html');
    //res.redirect('/about'); var pgp =require('pg-promise');
    var users_id = req.param('users_id');
    var sql = 'select * from users';
    if (users_id) {
        sql += ' where users_id ='+ users_id + ' order by users_id ASC';
        }
    db.any(sql+ ' order by users_id ASC')
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/users',{users:data})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })
    function beforeRender(req, res, done) {
        // merge in some values for later use in engine
        // and preserve other values which are already in
        req.data = Object.assign({}, req.data, {foo: "foo"})
        done()
      }
});

//Update data products 
app.post('/products/update',function(req,res){
    var product_id = req.body.product_id;
    var title = req.body.title;
    var price = req.body.price;
    var sql =`update products set title = '${title}',price='${price}' where product_id = '${product_id}'` ;
  
   
    db.any(sql)
    .then(function (data) {
        console.log('DATA:' + data);
        res.redirect('/products')

    })
    .catch(function (error) {
        console.log('ERROR:' + error);
    })
});


//Update data users 
app.post('/user/update',function(req,res){
    var users_id = req.body.users_id;
    var email = req.body.email;
    var password = req.body.password;
    var sql =`UPDATE users 
                SET email = '${email}', password = '${password}' 
                WHERE users_id = '${users_id}'` ;
  
   
    db.any(sql)
    .then(function (data) {
        console.log('DATA:' + data);
        res.redirect('/users')

    })
    .catch(function (error) {
        console.log('ERROR:' + error);
    })
});

app.get('/products_delete/:product_id', function (req, res) {
  
    var product_id = req.params.product_id;
    var sql = 'DELETE FROM products';
    if (product_id) {
        sql += ' WHERE product_id ='+product_id; 
        }
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
        res.redirect('/products')
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })

});

app.get('/users_delete/:users_id', function (req, res) {
  
    var users_id = req.params.users_id;
    var sql = 'DELETE FROM users';
    if (users_id) {
        sql += ' WHERE users_id ='+ users_id; 
        }
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
        res.redirect('/users')
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })

});
app.get('/insertpro', function (req, res) {
    var time = moment().format();
    res.render('pages/insertpro', { time: time});
});

app.post('/products/insertpro',function(req,res){
    var product_id = req.body.product_id;
    var title = req.body.title;
    var price = req.body.price;
    var time = req.body.time;
    var sql =`INSERT INTO products (product_id, title, price,created_at)
    VALUES ('${product_id}', '${title}', '${price}', '${time}')`;
  
    console.log('UPDATE:' + sql);
    db.any(sql)
    .then(function (data) {
        console.log('DATA:' + data);
        res.redirect('/products')

    })
    .catch(function (error) {
        console.log('ERROR:' + error);
    })
    
});

app.get('/insertusers', function (req, res) {
    var time = moment().format();
    res.render('pages/insertusers', { time: time});
});

app.post('/users/insertusers',function(req,res){
    var users_id = req.body.users_id;
    var email = req.body.email;
    var password = req.body.password;
    var time = req.body.time;
    var sql =`INSERT INTO users (users_id, email, password,created_at)
    VALUES ('${users_id}', '${email}', '${password}', '${time}')`;
  
    console.log('UPDATE:' + sql);
    db.any(sql)
    .then(function (data) {
        console.log('DATA:' + data);
        res.redirect('/users')

    })
    .catch(function (error) {
        console.log('ERROR:' + error);
    })
    
});


app.get('/Report_product', function(req, res) {
    var sql ='select products.product_id,products.title,sum(purchase_items.quantity) as quantity,sum(purchase_items.price) as price from products inner join purchase_items on purchase_items.product_id=products.product_id group by products.product_id;select sum(quantity) as squantity,sum(price) as sprice from purchase_items';
    db.multi(sql)
    .then(function  (data) 
    {
 
        // console.log('DATA' + data);
        res.render('pages/Report_product', { products: data[0],sum: data[1]});
    })
    .catch(function (data) 
    {
        console.log('ERROR' + error);
    })
});

app.get('/Report_users', function(req, res) {
    var sql='select purchases.users_id,purchases.name,users.email,sum(purchase_items.price) as price from purchases inner join users on users.users_id=purchases.users_id inner join purchase_items on purchase_items.purchase_id=purchases.purchase_id group by purchases.users_id,purchases.name,users.email order by sum(purchase_items.price) desc LIMIT 25;'
    db.any(sql)
        .then(function (data) 
        {
            //f
            // console.log('DATA' + data);
            res.render('pages/Report_users', { users : data });
        })
        .catch(function (data) 
        {
            console.log('ERROR' + error);
        })
});



var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});
