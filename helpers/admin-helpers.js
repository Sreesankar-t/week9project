var db=require("../config/connection");
var collection=require("../config/collections");
const bcrypt=require('bcrypt');
const objectId=require("mongodb").ObjectId;
const { ObjectId } = require("mongodb");
const { use } = require('../routes/admin')

module.exports = {
   
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false;
            let response={}
            console.log(adminData)
            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:adminData.Email})
            console.log(admin)
            if(admin){
              bcrypt.compare(adminData.Password,admin.Password).then((status)=>{
                if(status){
                  console.log("login success");
                  response.admin=admin
                  response.status=true
                  resolve(response)
                }else{
                  console.log("login failed");
                  resolve({status:false})
                }
              })
            
            }else{
              console.log("login failed");
              resolve({status:false})
            }
          })
    },
    getAllUsers:(user)=>{
        return new Promise(async(resolve,reject)=>{
          let users=await db.get().collection(collection.USER_COLLECTION).find({}).toArray()
          resolve(users)
        })
      }
}