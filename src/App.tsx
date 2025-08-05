import { useState, useRef, useEffect, useReducer } from 'react'


interface Todo {
  id: number
  text: string
  remaining: number // 残り秒数
}

type State = {
  todos: Todo[]
  inputValue: string
}

type Action =
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'ADD_TODO' }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'EDIT_TODO'; payload: { id: number; text: string } }
  | { type: 'MOVE_TODO'; payload: { from: number; to: number } }
  | { type: 'TICK' }

const DEFAULT_LIMIT = 10 // 制限時間（秒）
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
        text: state.inputValue,
        remaining: DEFAULT_LIMIT
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
    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
        )
      }
    // タイマー減算アクション
    case 'TICK': {
      // 1秒減らし、0以下なら削除
      const todos = state.todos
        .map(todo => ({ ...todo, remaining: todo.remaining - 1 }))
        .filter(todo => todo.remaining > 0)
      return { ...state, todos }
    }
    case 'MOVE_TODO': {
      const { from, to } = action.payload
      if (from < 0 || to < 0 || from >= state.todos.length || to >= state.todos.length) return state
      const todos = [...state.todos]
      const [moved] = todos.splice(from, 1)
      todos.splice(to, 0, moved)
      return { ...state, todos }
    }
    default:
      return state
  }
}



function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [editId, setEditId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (state.inputValue === '') {
      inputRef.current?.focus()
    }
  }, [state.inputValue])

  const startEdit = (todo: Todo) => {
    setEditId(todo.id)
    setEditText(todo.text)
  }

  const submitEdit = (id: number) => {
    if (editText.trim() !== '') {
      dispatch({ type: 'EDIT_TODO', payload: { id, text: editText } })
    }
    setEditId(null)
    setEditText('')
  }

  return (
    <>
      <div style={{ paddingLeft: "24px" }}>
        <h1>TODOリスト</h1>
        <div>
          <input
            ref={inputRef}
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
          {state.todos.map((todo, idx) => (
            <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ minWidth: 60, color: todo.remaining <= 10 ? 'red' : undefined }}>
                残り: {todo.remaining}s
              </span>
              {editId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') submitEdit(todo.id)
                    }}
                    autoFocus
                    style={{ marginRight: 4 }}
                  />
                  <button onClick={() => submitEdit(todo.id)}>保存</button>
                  <button onClick={() => { setEditId(null); setEditText('') }}>キャンセル</button>
                </>
              ) : (
                <>
                  <span>{todo.text}</span>
                  <button onClick={() => startEdit(todo)}>編集</button>
                </>
              )}
              <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>削除</button>
              <button
                onClick={() => dispatch({ type: 'MOVE_TODO', payload: { from: idx, to: idx - 1 } })}
                disabled={idx === 0}
                title="上に移動"
              >↑</button>
              <button
                onClick={() => dispatch({ type: 'MOVE_TODO', payload: { from: idx, to: idx + 1 } })}
                disabled={idx === state.todos.length - 1}
                title="下に移動"
              >↓</button>
            </li>
          ))}
        </ul>
        {state.todos.length === 0 && <p>TODOがありません</p>}
      </div>
    </>
  )
}

export default App
