import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios library
import Button from "../Components/Button";
import InputBox from "../Components/InputBox";
const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    return (
        <div className=" h-72 p-12  m-32 mx-44  border-4 border-blue-600 shadow-2xl rounded ">
            <div className=" flex flex-col mx-auto gap-7 justify-center rounded-lg bg-white w-fit text-center p-2 h-max ">
            <InputBox  label="email" Click={(e) => {
                setEmail(e.currentTarget.value);
            }} 
            />
            <InputBox  label="password" Click={(e) => {
                setPassword(e.currentTarget.value);
            }}/>    
           
            <Button Click={async () => {
                const response = await axios.post("http://localhost:8787/api/v1/user/signin", {
                    email: email,
                    password: password,
                });
                localStorage.setItem('token', response.data.token);

                    // Set the token in the Axios default headers
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                    console.log(response.data.authorId);
                    console.log(response.data.userId);
                    localStorage.setItem('userId', response.data.authorId);
                console.log(response.data.token);
                navigate("/bulkblog");
            }} label="Sign Up"/>
            
        </div>
        </div>
    )
}
export default Signup;