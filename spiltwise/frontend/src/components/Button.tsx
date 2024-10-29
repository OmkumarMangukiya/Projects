import React from "react"
export interface ButtonProps{
    click:()=>void;
    name:string;
    className?: string; 
}
const Button :React.FC<ButtonProps>= ({click, name, className})=>{
    return<>
    <div className={`rounded-md  bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-950 focus:shadow-none active:bg-slate-950 hover:bg-slate-950 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 ${className}`}>
    <button onClick={click} >
        <div className="flex justify-center">{name}</div>
  
</button>
</div>
    </>
}

export default Button
