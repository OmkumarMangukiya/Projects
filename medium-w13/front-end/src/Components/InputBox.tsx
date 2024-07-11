import { ChangeEvent } from 'react';

interface InputBoxProps {
    label: string;
    Click: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputBox = ({ label, Click }: InputBoxProps) => {
    return (
        <div>
            <label htmlFor={label}></label>
            <input 
                type="text" 
                placeholder={label} 
                onChange={Click} 
                className="border-2 border-gray-900 rounded-lg transition focus:scale-105 shadow-2xl hover:shadow-2xl p-2 w-72 h-10 m-auto text-center focus:placeholder:opacity-0"
            />
        </div>
    );
}
 
export default InputBox;