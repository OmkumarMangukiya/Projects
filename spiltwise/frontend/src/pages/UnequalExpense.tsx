import { useEffect, useState } from "react";
import axios from "axios";
import Input from "../components/Input";
const UnequalExpense = () => {
    const [users, setUsers] = useState<{ id: string, username: string }[]>([]);
    const [name,setName] = useState("");
    const [total,setTotal]=useState(0);
    const [userArr, setUserArr] = useState<{ [key: string]: number }>({});
    const groupId = localStorage.getItem('groupId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8787/api/v1/group/users`, {
                    headers: {
                        groupId: groupId
                    }
                });
                setUsers(response.data);
                // Initialize userArr with usernames and default values
                const initialUserArr: { [key: string]: number } = {};
                response.data.forEach((user: { username: string }) => {
                    initialUserArr[user.username] = 0;
                });
                setUserArr(initialUserArr);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchData();
    }, [groupId]);

    const handleInputChange = (username: string, value: string) => {
        setUserArr((prevUserArr) => ({
            ...prevUserArr,
            [username]: parseFloat(value) || 0
        }));
    };

    const handleClick = async () => {
        try {
            const response = await axios.post(`http://localhost:8787/api/v1/group/unequalexpense`, {
                userArr: userArr,
                name:name,
                Total:total
            }, {
                headers: {
                    groupId: groupId,
                    token: token
                }
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error sending unequal expense:', error);
        }
    };

    return (
        <div>
            <div>
                <Input label="name" type="text" change={(e)=>(setName(e.target.value))}></Input>
            </div>
            <div>
                <Input label="total" type="number" change={(e)=>(setTotal(parseFloat(e.target.value) || 0))}></Input>
            </div>
            <div>
            {users.map((user) => (
                <div key={user.id} className="flex items-center mb-4">
                    <span className="mr-4">{user.username}</span>
                    <input
                        type="text"
                        className="border p-2"
                        placeholder="Enter value"
                        onChange={(e) => handleInputChange(user.username, e.target.value)}
                    />
                </div>
            ))}
            </div>
            <button onClick={handleClick} className="mt-4 p-2 bg-blue-500 text-white">
                Submit
            </button>
        </div>
    );
};

export default UnequalExpense;