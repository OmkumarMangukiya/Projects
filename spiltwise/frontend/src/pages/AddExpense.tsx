import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
const AddExpense = ()=>{
    const[username,setUsername] = useState("");
    const [Name,setName] = useState("");
    const[Total,setTotal] = useState("");
    const [DivideTo,setDivideTo] = useState<string[]>([]);
    const groupId = localStorage.getItem('groupId');
    const navigate = useNavigate();
    const handleOnClick = async()=>{
        const response = await axios.post('http://localhost:8787/api/v1/group/addexpense',{username,Name,Total,DivideTo,groupId})
        console.log(response)
        navigate('/group')
    }
    interface User {
        id: string;
        username: string;
    }

    const [users, setUsers] = useState<User[]>([]);

                    useEffect(() => {
                        const fetchUsers = async () => {
                            try {
                                const response = await axios.get('http://localhost:8787/api/v1/users');
                                // Ensure the response data is an array
                                if (Array.isArray(response.data)) {
                                    setUsers(response.data);
                                } else {
                                    console.error("Expected an array but got:", response.data);
                                }
                            } catch (error) {
                                console.error("Error fetching users:", error);
                            }
                        };
                        fetchUsers();
                    }, []);

    return (
        <>
            <div className="">
                <div className="mx-7 mt-60 px-64 pt-6 pb-6 grid grid-cols-1 gap-2">
                    <Input label="username" type="string" change={(e) => setUsername(e.target.value)}></Input>
                    <Input label="Expense Name" type="string" change={(e) => setName(e.target.value)}></Input>
                    <Input label="Total" type="number" change={(e) => setTotal(e.target.value)}></Input>
                 

                    
                    {/* <div className="border-2 border-black p-1 ">
                        <label className="block font-medium text-md text-gray-700 pt-1 ">Divide To</label>
                        <hr className="my-2 border-t-2 border-black w-full " />
                        <select
                            multiple
                            value={DivideTo}
                            onChange={(e) => setDivideTo(Array.from(e.target.selectedOptions, option => option.value))}
                            className="mt-1  block w-full pl-1 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {users.map((user) => (
                        <option key={user.id} value={user.username} className=" text-base">
                            {user.username}
                        </option>
                    ))}
                        </select>
                    </div> */}
     <div className="border-2 border-black p-1 px-10 h-40 overflow-y-auto">
  <label className="block font-medium text-md text-gray-700 pt-2 pb-1 ">Divide To</label>
  <hr className="my-2 border-t-2 border-black w-full pb-2" />
  <div className="mt-1 grid grid-cols-1 gap-2 pb-2">
    {users.map((user) => (
      <div
        key={user.id}
        className={`flex items-center space-x-2 cursor-pointer  ${DivideTo.includes(user.username) ? 'border-2 border-black rounded-lg pl-1' : 'bg-gray-900 text-white rounded-lg pl-2'}`}
        onClick={() => {
          if (DivideTo.includes(user.username)) {
            setDivideTo(DivideTo.filter((username) => username !== user.username));
          } else {
            setDivideTo([...DivideTo, user.username]);
          }
        }}
      >
        <span className="text-base">{user.username}</span>
      </div>
    ))}
  </div>
</div>
                    {/* <div className="border-2 border-black p-1 px-10  ">
                    <label className="block font-medium text-md text-gray-700 pt-1 ">Divide To</label>
                    <hr className="my-2 border-t-2 border-black w-full " />
                    <div className="mt-1 grid grid-cols-1 gap-2 pb-2">
                        {users.map((user) => (
                            <label key={user.id} className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    value={  user.username}
                                    checked={DivideTo.includes(user.username)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setDivideTo([...DivideTo, user.username]);
                                        } else {
                                            setDivideTo(DivideTo.filter((username) => username !== user.username));
                                        }
                                    }}
                                    className={`form-checkbox h-4 w-4 transition duration-150 ease-in-out ${DivideTo.includes(user.username) ? 'text-green-500' : 'text-blue-500'}`}
                                />
                                <span className="text-base">{user.username}</span>
                            </label>
                        ))}
                    </div>
                </div> */}
                </div>
                
                <div className="pt-3  flex justify-center">
                    <Button name="Add Expense" click={handleOnClick}></Button>
                </div>
            </div>

        </>
    )
}
export default AddExpense;