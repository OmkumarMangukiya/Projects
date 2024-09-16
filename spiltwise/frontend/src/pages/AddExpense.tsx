import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const AddExpense = ()=>{
    const[username,setUsername] = useState("");
    const [Name,setName] = useState("");
    const[Total,setTotal] = useState("");
    const [DivideTo,setDivideTo] = useState<string[]>([]);
    const [groupId,setGroup] = useState("");
    const navigate = useNavigate();
    const handleOnClick = async()=>{
        const response = await axios.post('http://localhost:8787/api/v1/group/addexpense',{username,Name,Total,DivideTo,groupId})
        console.log(response)
        navigate('/group')
    }
    return (
        <>
            <div className="">
                <div className="mx-7 mt-60 px-64 pt-6 pb-6 grid grid-cols-1 gap-2">
                    <Input label="username" type="string" change={(e) => setUsername(e.target.value)}></Input>
                    <Input label="Name" type="string" change={(e) => setName(e.target.value)}></Input>
                    <Input label="Total" type="number" change={(e) => setTotal(e.target.value)}></Input>
                    <Input label="DivideTo" type="string" change={(e) => setDivideTo(e.target.value.split(','))}></Input>
                    <Input label="GroupId" type="string" change={(e) => setGroup(e.target.value)}></Input>
                </div>
                <div className="pt-3  flex justify-center">
                    <Button name="Add Expense" click={handleOnClick}></Button>
                </div>
            </div>

        </>
    )
}
export default AddExpense;