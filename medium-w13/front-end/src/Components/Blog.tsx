
interface BlogProps {
    title: string;
    content: string;
    id:string;
}

const  Blog = ({title, content,id}: BlogProps)=> { 
    return (
        <div>
            <h1>title = {title}</h1>
            <p>content = {content}</p>
            <p>id = {id}</p>
        </div>
    )
}
export default Blog;    