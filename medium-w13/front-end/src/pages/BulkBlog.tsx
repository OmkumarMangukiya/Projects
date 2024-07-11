import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios library
import Blog from "../Components/Blog";
import { useState } from "react";
import Button from "../Components/Button";

interface BlogProps {
    title: string;
    content: string;
    id:string;
}

const BulkBlog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<BlogProps[]>([]);
    return <div>
        <Button
        label="Get All Blogs"
        Click={async()=>{const response = await axios.get("http://localhost:8787/api/v1/blog/bulk")
               setBlogs(response.data);}} />
    
    
        
                {blogs.map((blog:BlogProps) => {
                    return (
                        <div>
                        <Blog title={blog.title} content={blog.content} id = {blog.id}/>
                        <br />
                        </div>
                    )
                })}
                <br />
                <br />
                <Button label="Search Blog by ID" Click={async ()=>{navigate("/getblog")}}/>
                    <br />
                    <br />
                <Button label="Create Blog " Click={async ()=>{navigate("/createblog")}}/> 
                               
                </div>
    
    
    
}
export default BulkBlog;