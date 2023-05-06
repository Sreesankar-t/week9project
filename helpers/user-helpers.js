var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
module.exports={
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
          if (!userData.Password || userData.Password.trim() === '')
           {
            reject(new Error('Password field is required'));
            return;
          }
    
          try {
            userData.Password = await bcrypt.hash(userData.Password, 10);
            const data = await db.get().collection(collection.USER_COLLECTION).insertOne(userData);
            resolve(data);
          } catch (err) {
            reject(err);
          }
        });
        },
        doLogin:(userData)=>{
            return new Promise(async (resolve,reject)=>{
                let loginStatus=false
                let response={}
               let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email}) 
               if(user){
                   bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if (status) {
                         console.log("login success");
                         response.user=user
                         response.status=true
                         resolve(response)

                    }else{
                        console.log("login faild");
                        resolve({status:false})
                    }

                   })

                }else{
                    console.log("login faild 2");
                    resolve({status:false})
                } 
               
            })
        }
    }