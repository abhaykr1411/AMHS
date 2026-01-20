import { useState } from "react";
import Validation from './loginValidation'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();

    const [values, setValues] = useState({
        username: "", password: ""
    })

    const [errors, setError] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(Validation(values)); 

        try{
            const response = await axios.post('http://localhost:5000/api/login', {
                username: values.username,
                password: values.password
            });
            console.log(response);
            if (response.data.success){
                if(response.data.user.role === "admin"){
                    navigate('/adminpage');
                }else if (response.data.user.role === "power_user"){
                    navigate('/powerpage');
                }else if (response.data.user.role === "normal_user"){
                    navigate('/userpage');
                }else{
                    alert(`Invalid user role ${response.data.user.role}`);
                }
            }else{
                alert(`login failed. pls check credentials`)
            }
        } catch(error){
            alert(`Loin failed. Pls check credentials!`);
        }
    }
    
    const handleInput = (event) =>{
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
                <form className="bg-white p-3 rounded w-25" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username"><strong>Username:</strong></label>
                        <input onChange={handleInput} name="username" type="text" placeholder="Enter Username" className="form-control rounded-0"/>
                        {errors.username && <span className="text-danger">{errors.username}</span>}
                    </div> 
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <input onChange={handleInput} type="password" name="password" placeholder="Enter Password" className="form-control rounded-0"/>
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div> 

                    <button type="submit" className="btn btn-success w-100">Log in</button>
                </form> 
            </div>
        </>
    );
}

export default Login;