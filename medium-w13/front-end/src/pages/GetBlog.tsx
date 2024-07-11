import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios library
import Button from "../Components/Button";
import InputBox from "../Components/InputBox";

const GetBlog = () => {
    const [blog, setBlog] = useState({
        title: "",
        content: ""
    
    });
    const [id, setId] = useState("");
    return (
        <div className=" h-72 p-12  m-32 mx-44  border-4 border-blue-600 shadow-2xl rounded ">
            <div className=" flex flex-col mx-auto gap-7 justify-center rounded-lg bg-white w-fit text-center p-2 h-max ">
                <InputBox label="id" Click={(e) => {
                    setId(e.currentTarget.value);
                }}
                />
                <Button Click={async () => {
                    
                    const response = await axios.get(`http://localhost:8787/api/v1/blog/${id}`);
                    setBlog(response.data);
                    console.log(response.data);
                }} label="Get Blog" />
                <div>
                    <h1>{blog.title}</h1>
                    <p>{blog.content}</p>
                </div>
            </div>
        </div>
    )
}
export default GetBlog