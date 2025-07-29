
import { useReducer } from 'react'

interface Todo {
  id: number
  text: string
}

type State = {
  todos: Todo[]
  inputValue: string
}

type Action =
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'ADD_TODO' }
  | { type: 'DELETE_TODO'; payload: number }

const initialState: State = {
  todos: [],
  inputValue: ''
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, inputValue: action.payload }
    case 'ADD_TODO':
      if (state.inputValue.trim() === '') return state
      const newTodo: Todo = {
        id: Date.now(),
        text: state.inputValue
      }
      return {
        todos: [...state.todos, newTodo],
        inputValue: ''
      }
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      }
    default:
      return state
  }
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <>
      <div style={{ paddingLeft: "24px" }}>
        <h1>TODOリスト</h1>
        <div>
          <input
            type="text"
            value={state.inputValue}
            onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
            placeholder="新しいTODOを入力"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                dispatch({ type: 'ADD_TODO' })
              }
            }}
          />
          <button onClick={() => dispatch({ type: 'ADD_TODO' })}>追加</button>
        </div>
        <ul>
          {state.todos.map((todo) => (
            <li key={todo.id}>
              <span>{todo.text}</span>
              <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>削除</button>
            </li>
          ))}
        </ul>
        {state.todos.length === 0 && <p>TODOがありません</p>}
      </div>
    </>
  )
}

export default App
