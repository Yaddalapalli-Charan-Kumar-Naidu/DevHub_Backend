import mongoose, { model } from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const {Schema}=mongoose;

const userSchema=new Schema({
    firstName:{
        type:String,
        minLength:3,
        required:true,
        maxLength:30
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:30
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter a valid email");
            }
        },
        required:true,
        unique:true
    },
    password:{
        type:String,
        minLength:8,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password should contain lowercase,uppercase,special characters and numbers");
                
            }
        }
    },
    age:{
        type:Number,
        min:15,
    },
    skills:{
        type:[String],
        validate(value){
            if(value.length>15){
                throw new Error("skills should be less than 15");
            }
        }
    },
    gender:{
        type:String,
        lowercase:true,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("gender should be male,female or other");
            }
        }
    },
    about:{
        type:String,
        default:"There is nothing much about me to say"
    },
    photoURL:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valid image url");
            }
        },
        default:"https://th.bing.com/th/id/OIP.aHjd-plky9ldFCUtDmhXAgHaHa?w=152&h=180&c=7&r=0&o=5&dpr=1.1&pid=1.7"
    }
},{
    timestamps:true
})

userSchema.methods.comparePassword=async function(password){
    const isValidPassword=await bcrypt.compare(password,this.password);
    return isValidPassword;
}
userSchema.methods.getJWT=function(){
    const token=jwt.sign({email:this.email,id:this._id},process.env.JWT_SECRET,{ expiresIn: '7d' });
    return token;
}

const User=new model("User",userSchema);

export {User};