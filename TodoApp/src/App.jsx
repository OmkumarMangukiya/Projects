import './App.css'
import { RecoilRoot, useRecoilValue } from 'recoil';
import { todosAtom } from './atoms';

function App() {
  return (
    <RecoilRoot>
      <Todos />
    </RecoilRoot>
  );
}

function Todos() {
  
  const todos = useRecoilValue(todosAtom);

  return (
    <>
      {todos.map((todo, index) => (
        <div key={index}>
          {todo.title}
          {todo.description}
          <br />
        </div>
      ))}
    </>
  );
}

export default App;