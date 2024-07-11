interface ButtonProps {
    Click: () => Promise<void>;
    label: string;
}

const Button = ({ Click, label }: ButtonProps) => {
    return (
        <button onClick={Click}
        className="transition duration-500 ease-in-out bg-blue-500 hover:bg-blue-700 hover:scale-110 text-white font-bold py-2 px-4 rounded-lg hover:shadow-md hover:border-2 hover:border-blue-800 "
        >{label}</button>
    );
}

export default Button;