import { atom, selector } from "recoil";
import axios from "axios";

export const todosAtom = atom({
  key: 'todosAtom',
  default: selector({
    key: "todosSelector",
    get: async () => {
      
      const res = await axios.get(`https://sum-server.100xdevs.com/todos`);
      return res.data.todos;
    },
  })
});