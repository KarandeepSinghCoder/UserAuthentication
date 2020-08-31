var express =require("express");//
var mongoose=require("mongoose"),//
    passport=require("passport"),//
    bodyParser=require("body-parser"),//
    localStrategy=require("passport-local"),
    User = require("./models/user.js"),
    passportLocalMongoose=require("passport-local-mongoose");
mongoose
.connect("mongodb://localhost/auth_demo_app",{
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
    console.log("fail");
    console.log(err);
});


var app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "HIII KARAN",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//============
//ROUTES
//============
app.get("/",function(req,res){
    res.render("home");
});
app.get("/secret",isLoggedIn,function(req,res){
    res.render("secret");
});

app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
     req.body.username;
     req.body.password;
     User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secret");
        });
     });
});
//============
//Login routes
//============
app.get("/login",function(req,res){
    res.render("login");
});
//login logic
app.post("/login",passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),function(req,res){

});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(3001,function(){
    console.log("Server started");
})