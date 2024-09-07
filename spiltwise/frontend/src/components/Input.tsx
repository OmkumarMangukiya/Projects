export interface InputProps{
    label:string;
    type:string;
    change : (x:React.ChangeEvent<HTMLInputElement>)=>void;
}
const Input:React.FC<InputProps> = ({label, type,change}) => {
    return (
        <>
            <div className="transition-all hover:bg-slate-300 flex justify-center w-full  ">
                <input className="w-full  outline-2 border-2 hover:scale-105 focus:scale-105 focus:text-white focus:bg-gray-900 border-black rounded-sm outline-black p-2" required={true} onChange={change} placeholder={label} type={type} />
            </div>
        </>
    );
}
export default Input