var express = require('express');
var router = express.Router();
var router=express.Router();
var productHelper=require('../helpers/product-helpers');
const productHelpers = require('../helpers/product-helpers');
const adminHelpers=require('../helpers/admin-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.admin && req.session.admin.loggedIn){
    next()
  }else{
    res.redirect('/admin/adminLogin')
  }
}
/* GET users listing. */
router.get('/', verifyLogin,function(req, res, next) {
productHelpers.getAllProducts().then((products)=>{
 console.log(products);
  res.render('admin/view-products',{admin:true,products});
})

});

router.get('/add-products',verifyLogin,(req,res)=>{
  res.render('admin/add-products')
})

router.post('/add-products',(req,res)=>{


  productHelper.addProduct(req.body,(insertedId)=>{
    let image=req.files.Image
    image.mv('./public/products-images/'+insertedId+'.jpg',(err)=>{
      if(!err){
        res.render('admin/add-products')
      }else{
        console.log(err);
      }
    })
    
  })
})

router.get('/delete-product/:id',(req,res)=>{
  let proId = req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})


router.get('/edit-product/:id',async(req,res)=>{
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  let insertedId=req.params.id;
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
       let image=req.files.Image
      image.mv('./public/products-images/'+insertedId+'.jpg')
    }
  })
})


router.get('/adminLogin',function(req,res){
  if(req.session.admin){
    res.redirect("/admin")  
  }
  else{
    res.render("admin/login",{"loginErr":req.session.adminLoginErr})
    req.session.adminLoginErr=false
  }
 
})
router.post('/adminLogin',(req,res)=>{
  adminHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      
      console.log("Admin in successfully loged in");
      req.session.admin=response.admin
      req.session.admin.loggedIn=true
      res.redirect('/admin')
    }
    else{
      req.session.adminLoginErr="Invalid user name or password"
      res.redirect('/admin/adminLogin') 
    }
  })
})
router.get("/adminLogout",function(req,res){
  req.session.admin=null
  res.redirect("/")
})
router.get("/user-data",verifyLogin,async (req,res)=>{
  let users=await adminHelpers.getAllUsers(req.session)
  res.render('admin/all-users',{admin:true,users})
})

module.exports = router;
