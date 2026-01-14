import { useState } from "react";
import Validation from './loginValidation'

function Login(){
    const [values, setValues] = useState({
        username: "", password: ""
    })

    const [errors, setError] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(Validation(values)); 
    }
    
    const handleInput = (event) =>{
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
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