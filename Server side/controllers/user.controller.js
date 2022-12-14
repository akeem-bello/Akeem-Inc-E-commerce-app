const userModel = require('../models/user.model');
const adminModel = require('../models/admin.model');
const productsModel = require('../models/products.model');
const SECRET = process.env.SECRET;
const SECRET2 = process.env.SECRET_TWO;
const jwt = require('jsonwebtoken');

const registerUser = (req, res)=>{
    const userDetails = req.body;
    const email = userDetails.email;
    userModel.findOne({email:email}, (err, result)=>{
        if(err){
            res.status(500).send({message: 'Internal Server Error.', status:false});
        }else{
            if(result){
                res.send({message: 'Email already exists.', status:false});
            }else{
                let form = new userModel(userDetails);
                form.save((err)=>{
                    if(err){
                        res.status(500).send({message: 'Sign up failed, please try again.', status:false});
                    }else{
                       res.send({message: 'Sign up successful.', status:true}); 
                    }
                })
            }
        }
    })
}

const userSignIn = (req, res)=>{
    const userDetails = req.body;
    const email = userDetails.email;
    const password = userDetails.password;
    userModel.findOne({email:email}, (err, user)=>{
        if(err){
            res.status(500).send({message: 'Internal Server Error.', satatus:false});
        }else{
            if(!user){
                res.send({message: 'Email does not exist, kindly create an account.', status: false});
            }else{
                user.validatePassword(password, (err, same)=>{
                    if(err){
                        res.status(500).send({message: 'Internal Server Error.', status: false});
                    }else{
                        if(!same){
                            res.send({message: 'Your password is incorrect.', status: false});
                        }else{
                            const token = jwt.sign({email}, SECRET, {expiresIn: '1h'})
                            res.send({message: 'Sign in successful.', status: true, token});
                        }
                    }
                })
            }
        }
    })
}

const registerAdmin = (req, res)=>{
    const adminDetails = req.body;
    const email = adminDetails.email;
    adminModel.findOne({email: email}, (err, result)=>{
        if(err){
            res.status(500).send({message: 'Internal Server Error.', status: false});
        }else{
            if(result){
                res.send({message: 'Admin already exists.', status: false});
            }else{
                let form = new adminModel(adminDetails);
                form.save((err)=>{
                    if(err){
                        res.status(500).send({message: 'Sign up failed, please try again later.', status:false});
                    }else{
                        res.send({message: 'Account created successfully.', status:true});
                    }
                })
            }
        }
    })
}

const adminSignIn = (req, res)=>{
    const adminDetails = req.body;
    const email = adminDetails.email;
    const password = adminDetails.password;
    adminModel.findOne({email:email}, (err, admin)=>{
        if(err){
            res.status(500).send({message: 'Internal Server Error.', status:false});
        }else{
            if(!admin){
                res.send({message: 'Admin does not exist, kindly create an admin account.', status:false});
            }else{
                admin.validatePassword(password, (err, same)=>{
                    if(err){
                        res.status(500).send({message: 'Internal Server Error', status:false});
                    }else{
                        if(!same){
                            res.send({message: 'Your password is incorrect.', status:false});
                        }else{
                            const token2 = jwt.sign({email}, SECRET2, {expiresIn: '1h'}); 
                            res.send({message: 'Sign in successful.', status:true, token2});
                        }
                    }
                })
            }
        }
    })
}

const addItems = (req, res)=>{
    const token2 = req.headers.authorization.split(' ')[1];
    jwt.verify(token2, SECRET2, (err, result)=>{
        if(err){
            res.send({message: 'jwt failed', err, status:false})
        }else{
            const email = result.email
            adminModel.findOne({email:email}, (err, result)=>{
                res.send({message: 'congrats', status:true, result})
            }) 
        } 
    })
    const productDetails = req.body;
    let form = new productsModel(productDetails);
    form.save((err)=>{
        if(err){
            res.status(500).send({message: 'Internal Server Error', status:false});
        }else{
            res.send({status:true});
        }
    })
}

const displayItems = (req, res)=>{
    productsModel.find((err, products)=>{
        if(err){
            console.log(err);
        }else{
            res.send({products});
        }
    })
}

module.exports = {
    registerUser, 
    userSignIn, 
    registerAdmin, 
    adminSignIn,
    addItems,
    displayItems
}