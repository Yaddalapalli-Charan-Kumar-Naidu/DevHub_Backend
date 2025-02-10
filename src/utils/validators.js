import validator from "validator";

export const signupValidator=(req)=>{
    const {email,password,firstName}=req?.body;
    if(!firstName){
        throw new Error("Enter a valid name");
    }
    if(!validator.isEmail(email)){
        throw new Error("Enter a valid email");
        
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("password should contain lowercase,uppercase,special characters and numbers");
    }
}
export const validateEdit=(req)=>{
    const Changable_details=["firstName","lastName","skills","about","age","gender","photoURL"];
    const isValid=Object.keys(req.body).every(element => (
        Changable_details.includes(element)
    ));
    return isValid;
}
