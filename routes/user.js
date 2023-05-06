var express = require('express');
var router = express.Router();

const productHelpers = require('../helpers/product-helpers');
const userHelpers=require('../helpers/user-helpers')
/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
    console.log(user);
  productHelpers.getAllProducts().then((products)=>{
  
     res.render('user/view-products',{products,user});
   })
});
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else
  res.render('user/login',{"loginErr":req.session.userLoginErr})
  req.session.user.userLoginErr=false
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
   
    req.session.user=response
    req.session.user.loggedIn=true
    res.redirect('/')
  })
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
  
    if(response.status){
     
      req.session.user=response.user
      req.session.user.loggedIn=true
    res.redirect('/')
    }else{
      req.session.userLoginErr="! invalid username or password !"
      res.redirect('/login')
    }

})
})
router.get('/logout',(req,res)=>{
  req.session.user=null
  res.redirect('/')
})


router.get('/add to cart',(req,res)=>{
  if(!req.session.loggedIn)

  res.redirect('/login')
})



module.exports = router;
