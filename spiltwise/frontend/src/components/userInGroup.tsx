interface User {
    name: string;
    money: number;
}
const UserInGroupComponent = ({ name, money }: User) => {
    return (
        <div className="grid-1 grid-cols-1 ">
            
            <p className="flex gap-1 pl-2 ${money >0 ?'text-green-500':money<0 ?'text-red-500':'' }" >{name} :  <p className="font-medium">{money}</p></p>
        </div>
    );
}
export default UserInGroupComponent