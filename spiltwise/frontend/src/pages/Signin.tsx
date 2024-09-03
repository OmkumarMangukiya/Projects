import React from "react";
import Button from "../components/Button.tsx";
import Input from "../components/Input.tsx";
import { useState } from "react";
import axios from 'axios';
export const Signin = () => {
    // const [email,setEmail]=useState("");
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
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            
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
            </div>
        </div>
    );
};