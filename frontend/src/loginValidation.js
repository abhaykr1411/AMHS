export default function Validation(values){
    let error = {};
    const username_pattern = /^[A-Za-z][A-Za-z0-9_]{3,19}$/;
    const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (values.username === "")
    {
        error.username = "username should not be empty";
    }else if (!username_pattern.test(values.username)){
        error.username = "Username can't starts with number or too short or has special character in them.. pls rectify";
    }else{
        error.username = ""
    }

    if (values.password === ""){
        error.password = "Password should not be empty";
    }else if (!password_pattern.test(values.password)){
        error.password = "min length of password is 8 character, it must have atleast 1 special character and atleast 1 chracter should be uppercase"
    }else{
        error.password = ""
    }

    return error;  
}