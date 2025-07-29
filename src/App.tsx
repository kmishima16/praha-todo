import { useState } from 'react'

interface Todo {
  id: number
  text: string
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')

  const addTodo = () => {
    if (inputValue.trim() === '') return
    
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue
    }
    
    setTodos([...todos, newTodo])
    setInputValue('')
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <>
      <div style={{ paddingLeft: "24px" }}>

      <h1>TODOリスト</h1>
      
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="新しいTODOを入力"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTodo()
            }
          }}
        />
        <button onClick={addTodo}>追加</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>削除</button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p>TODOがありません</p>}
      </div>
    </>
  )
}

export default App
