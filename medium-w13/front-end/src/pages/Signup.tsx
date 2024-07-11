import { useState } from "react";
import axios from "axios"; // Import axios library
import Button from "../Components/Button";
import InputBox from "../Components/InputBox";
const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    return (
        <div className=" h-96 p-12  m-32 mx-44  border-4 border-blue-600 shadow-2xl rounded ">
            <div className=" flex flex-col mx-auto gap-7 justify-center rounded-lg bg-white w-fit text-center p-2 h-max ">
            <InputBox  label="email" Click={(e) => {
                setEmail(e.currentTarget.value);
            }} 
            />
            <InputBox  label="password" Click={(e) => {
                setPassword(e.currentTarget.value);
            }}/>    
            <InputBox  label="name" Click={(e) => {
                setName(e.currentTarget.value);
            }}/>
            <Button Click={async () => {
                const response = await axios.post("http://localhost:8787/api/v1/user/signup", {
                    email: email,
                    password: password,
                    name: name
            
                });
                localStorage.setItem("token", response.data.token);

            }} label="Sign Up"/>

        </div>
        </div>
    )
}
export default Signup;