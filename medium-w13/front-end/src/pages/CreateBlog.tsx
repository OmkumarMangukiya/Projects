import { useState } from "react";
import axios from "axios"; // Import axios library
import Button from "../Components/Button";
import InputBox from "../Components/InputBox";
const CreateBlog = ()=>{
    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');
    return(
        <div className=" h-72 p-12  m-32 mx-44  border-4 border-blue-600 shadow-2xl rounded ">
            <div className=" flex flex-col mx-auto gap-7 justify-center rounded-lg bg-white w-fit text-center p-2 h-max ">
            <InputBox label = "Title" Click={(e)=>{
                setTitle(e.target.value)
            }}></InputBox>
            <InputBox label = "Content" Click={(e)=>{
                setContent(e.target.value)
            }}></InputBox>
            <Button label = "Create Blog" Click={async()=>{
                const ids = localStorage.getItem('userId')
                 await axios.post("http://localhost:8787/api/v1/blog/create",{
                    title:title,
                    content:content,
                    authorId: ids
                })

                console.log(localStorage.getItem('userId'))
                console.log(title)
            }}></Button>
        </div>
        </div>
    )

}
export default CreateBlog