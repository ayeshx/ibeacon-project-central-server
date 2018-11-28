const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Telemetry = require('./models/telemetry');
const Beacon = require('./models/beacon');
const MenuItem = require('./models/menuitem');
const User = require('./models/user');
const Order = require('./models/order');
const app = express();
 
 var mongodbHost = 'ds259912.mlab.com';
 var mongodbPort = '59912';
 var authenticate = 'shilpa:est123@'; 
 var mongodbDatabase = '490_beacon';
 var cart = [];
 var idTable = {
     38872:"39f774e86fece799",
     45700:"88e490df11769a5b",
     16549:"b19334231ae24c5e"    
 }
 var uuidTable = [
     'D0D3FA86-CA76-45EC-9BD9-6AF487801DC6',
     'D0D3FA86-CA76-45EC-9BD9-6AF4FE1A9236'
 ]
 
var url = 'mongodb://'+authenticate+mongodbHost+':'+mongodbPort + '/' + mongodbDatabase;
mongoose.connect(url).then( () => {
    console.log("Connected correctly to server.");
    // const capp = new MenuItem({
    //     _id:new mongoose.Types.ObjectId(),
    //     img: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Cappuccino_at_Sightglass_Coffee.jpg",
    //     name: "Cappucino",
    //     price: 15.5,
    //     description: "a type of coffee made with espresso and milk that has been frothed up with pressurized steam."
    // });
    // const mocha = new MenuItem({
    //     _id: new mongoose.Types.ObjectId(),
    //     img: "http://theclassicvapeco.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/c/a/cafe-mocha-e-liquid.jpg",
    //     name: "Mocha",
    //     price: 14,
    //     description: "also called mocaccino (Italian: [mokatˈtʃiːno]), is a chocolate-flavored variant of a caffè latte."
    // });
    // const latte = new MenuItem({
    //     _id: new mongoose.Types.ObjectId(),
    //     img: "https://www.nespresso.com/ncp/res/uploads/recipes/Caff%C3%A8%20Latte%20by%20Nespresso.jpg",
    //     name: "Latte",
    //     price: 10,
    //     description: "A latte (/ˈlɑːteɪ/ or /ˈlæteɪ/)[1][2] is a coffee drink made with espresso and steamed milk."
    // });
    // capp.save().then(()=>{
    //     console.log('Saved Cappucino');
    // });
    // mocha.save().then(()=>{
    //     console.log('Saved Mocha!');
    // });
    // latte.save().then(()=>{
    //     console.log('Saved Latte!');
    // });
    // const beacon1 = new Beacon({
    //     "id": "ea00e4a9267f",
    //     "uuid": "B9407F30-F5F8-466E-AFF9-25556B579999",
    //     "major": 12870,
    //     "minor": 16549,
    // });
    // const beacon2 = new Beacon({
    //     "id": "d257bce4414f",
    //     "uuid": "B9407F30-F5F8-466E-AFF9-25556B579999",
    //     "major": 12870,
    //     "minor": 45700,
    // });
    // const beacon3 = new Beacon({
    //     "id": "e806f56eb5fe",
    //     "uuid": "B9407F30-F5F8-466E-AFF9-25556B579999",
    //     "major": 12870,
    //     "minor": 38872
    // });
    // beacon1.save().then(()=>{
    //     console.log('Saved a beacon1');
    // });
    // beacon2.save().then(()=>{
    //     console.log('Saved a beacon2');
    // });
    // beacon3.save().then(()=>{
    //     console.log('Saved a beacon3');
    // });    
}  
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-ALlow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
  });

var AuthController = require('./auth/AuthController');
app.use('/api/auth/logout', (req,res,next)=>{
    cart = [];
    next();
});
app.use('/api/auth', AuthController);

var user = {};
app.get('/api/getmenuitems',(req,res)=>{
    MenuItem.findOne({_id:req.query.item},(err,re)=>{
        res.status(200).json({item:re});
    });
});
app.get('/api/getuser',(req,res)=>{
    User.findOne({username:req.query.username},(err,userr)=>{
        if(err){
            console.log(err);
        } else {
            user = userr;
            console.log('User is now:'+user);
            console.log('User fav items'+user.favItems);
            console.log('Received request for user');
            user.preferences = [];
            console.log(user.favItems + 'fav');
            // user.favItems = JSON.parse(user.favItems);
            // user.favItems.forEach(item=>{
            //     MenuItem.findOne({_id:item._id},(err,re)=>{
            //         user.preferences.push(re);
            //     });
            // });
            flag = true;
            console.log('User is now:'+user);
            res.status(200).json(user);
            // console.log('FavItem is :'+favItems);
            // user.favItems = favItems;
            
        }
    });
    
});

app.get('/api/getconditions',(req,res)=>{
    
});

app.get('/api/getitems',(req,res)=>{
    console.log('Getting items now!');
    MenuItem.find((err,result)=>{
        if(err){
            console.log('Couldnt find any items!');
        } else {
            console.log(result);
            res.status(200).json({items:result});
        }
    });
});

app.post('/api/checkout',(req,res)=>{
    console.log(req.body);
    console.log(req.body.user);
    var userr = JSON.parse(req.body.user);
    console.log(userr.username);
    const cart2 = JSON.parse(req.body.cart);
    console.log(cart2);
    let ord;
    User.findOne({email:userr.email},(err,user)=>{
        console.log(user);
        const order = new Order({
            customer:user,
            bill:req.body.total,
            items:cart2
        });
        ord = order;
        order.save();
        console.log(order);
        
        // user.save(()=>{
        //     console.log('Saved');
        // });
        console.log(user);
        // User.findOneAndUpdate({email:user.email},{$push: {orderHistory:order}});
        //     if(err){
        //         console.log(err);
        //     }
        //     console.log(u);
        // });
        // res.send('Successfully updated');
        userr = user;
    }).then(resolve=>{
        User.findByIdAndUpdate({_id:userr._id},{$push: {orderHistory:ord}},(err,r)=>{
            console.log(r);
            res.status(200).send('Inserted');
        });
    });
    
    cart = [];
    
});

app.post('/api/addtofav',(req,res)=>{
    const user = JSON.parse(req.body.user);
    // const item = new MenuItem({
    //     // _id:req.body.item._id,
    //     img:req.body.item.img,
    //     name:req.body.item.name,
    //     price:req.body.item.price,
    //     description:req.body.item.description
    // });
    console.log(user);
    const it = JSON.parse(req.body.item);
    // console.log(item);
    console.log("Name:"+it.name);
    console.log(user.email);
    MenuItem.findOne({name:it.name},(err,r)=>{
        if(err){
            console.log(err);
        }
        console.log(r);
        User.findOneAndUpdate({email:user.email},{$push: {favItems:r}},(erro,re)=>{
            console.log(erro);
            console.log(re);
            res.status(200).send('Added a favorite item');
        });
    });
    
});

app.post('/api/addtocart',(req,res)=>{
    const item = req.body.item;
    console.log('Req body'+JSON.stringify(req.body));
    console.log('Item received:' + JSON.stringify(item));
    cart.push(item);
    console.log('Added Item');
    res.status(200).send('Added item!');
});

app.post('/api/removefromcart',(req,res)=>{
    const item = req.body.item;
    const index = cart.indexOf(item);
    cart.splice(index,1);
    res.status(200).send('Removed item!');
});

app.get('/api/getcartitems',(req,res)=>{
    res.status(200).json({cart:cart});
});

module.exports = app;