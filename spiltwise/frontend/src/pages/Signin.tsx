import Button from "../components/Button.tsx";
import Input from "../components/Input.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
export const Signin = () => {
    // const [email,setEmail]=useState("");
    const navigate = useNavigate();
    const [password,setPassword]=useState("");
    const [username,setUsername]=useState("");
    const handleSignIn = () => {
        console.log("run");
        // const apiUrl = import.meta.env.REACT_APP_API_URL;
        axios.post(`http://localhost:8787/api/v1/user/signin`, { username, password })
            .then(response => {
                console.log("Sign in successful", response);
            })
            .catch(error => {
                console.error("There was an error signing in!", error);
            });
    };
    return (
        <div className="flex justify-around">
        <div className="bg-blue-100 w-full flex justify-center transition-all hover:shadow-inner text-4xl pt-80 px-60 font-medium" >
            Splitting Money is now &nbsp;
            
                <div className=" text-green-600">
                    easy
                </div>
            </div>
        <div className="flex items-center w-full justify-center min-h-screen  bg-gray-200 border-s-2 border-black">
            
            <div className="w-full max-w-sm p-8 bg-white rounded-md shadow-md">
                <div className="flex justify-center text-xl mb-4">
            <h2 className="mb-6">Sign In Page</h2>
            </div>
                <div className="mb-8">
                    <Input change={(e) => setUsername(e.target.value)} label="Username" type="text" />
                </div>
                <div className="mb-8">
                    <Input change={(e) => setPassword(e.target.value)} label="Password" type="password" />
                </div>
               
                <div>
                    <Button name="Sign in" click={handleSignIn} />
                </div>
                <div className="flex ">
                <div className="pt-2 pr-2">Don't have account?</div>
                <button className="pt-2 text-green-500 font-medium" onClick={()=>navigate('/signup')}>Sign Up Now</button>
                </div>
            </div>
        </div>
        </div>  );
};