interface User {
    name: string;
    money: number;
}

const UserInGroupComponent = ({ name, money }: User) => {
    const moneyClass = money < 0 ? 'text-red-500' : money > 0 ? 'text-green-500':'text-black';

    return (
        <div className="grid grid-cols-1">
            <div className={`flex gap-1 pl-2 `}>
                {name} : <p className={`font-light ${moneyClass}`}>{money}</p>
            </div>
        </div>
    );
}

export default UserInGroupComponent;