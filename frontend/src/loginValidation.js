export default function Validation(values){
    let error = {};

    if (values.username === "")
    {
        error.username = "username should not be empty";
    }else{
        error.username = ""
    }

    if (values.password === ""){
        error.password = "Password should not be empty";
    }else{
        error.password = ""
    }

    return error;  
}