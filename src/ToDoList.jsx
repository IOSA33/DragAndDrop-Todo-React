import { useState, useEffect} from 'react'
import React from 'react'
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor , useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from './SortableItem'

const Title = ({ currentList, onClickDeleteList, currentListID }) => {
  if (currentListID === 1) {
    return (
      <h1 className="mx-auto m-3 mt-6 mb-6 text-2xl"> To Do List  v1.5</h1>
    )
  }
  return (
   <div>
     <h1 className="mx-auto m-3 mt-6 mb-6 text-2xl"> To Do List  v1.4</h1>
     <button className='px-5 h-10 m-0.5 mb-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
      onClick={onClickDeleteList}
     > Delete <b> {currentList.name} </b> List</button>
   </div>
  )
}

const ShowMenu = ({ newTask, handleInputChange, addTask, bucket, addList, setShowLists }) => {
  return (
    <div className="flex space-x-4 mb-4 flex-wrap">
        <input
            className="max-w-xl mb-1 w-full h-10 border-2 border-solid border-gray-300 rounded-lg p-2"
            type="text"
            placeholder="Enter a Todo"
            value={newTask}
            onChange={handleInputChange} 
          />

        <div className='flex items-center gap-2'> 
            <button
              className="px-5 h-10 mb-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={addTask} > Add 
            </button>

          <button 
            className='px-5 h-10 mb-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
            onClick={bucket}
          > 
            🗑️
          </button>

          <button className='px-5 h-10 mb-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition' 
            onClick={addList}>
            Add List
          </button>

          <button className='px-5 h-10 mb-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition' 
            onClick={setShowLists}>
            📋
          </button>
        </div>

      </div>
  )
}

const ShowLists = ({ lists, setCurrentListID, showLists }) => {
  if (showLists === false) {
    return (
      <></>
    )
  } else {  
    return (
      <div>
        Current Lists
        <br></br>
        {lists.map(list => {
          return (
              <button key={list.id} className='px-5 h-10 m-0.5 mb-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
                  type="button" onClick={() => { 
                    setCurrentListID(list.id)
                  }}>

                  {list.name}
              </button>
          )
        })}
      </div>
    )
  }
}

const ShowToDoes = ({ list, sensors, closestCenter, handleDragEnd, verticalListSortingStrategy, done, deleteTask }) => {
  if (list?.length === 0) {
    return (
      <></>
    )
  } else {
   return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={list} strategy={verticalListSortingStrategy}>

          <ul className=''>
              {list.map((task) => (
                <SortableItem  key={task.id} id={task.id}>

                  <li className="mb-2 bg-white p-3 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 flex justify-between items-start">
                    <div className="flex items-center flex-grow">
                      <input 
                        type='checkbox' 
                        onChange={() => done(task.id)}
                        checked={task.done}
                        className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-green-500 checked:border-green-500
                                relative cursor-pointer transition-colors flex-shrink-0"
                      />
                      <span className="ml-2 text-lg font-semibold text-gray-700 break-all flex-grow">
                        {task.text}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)} 
                      className="ml-3 hover:text-red-600 transition duration-200" >
                      🔥
                    </button>
                  </li>

                </SortableItem> 
              ))}
          </ul>

        </SortableContext>
      </DndContext>
    )
  }
}


const TodoList = () => {
    const [tasks, setTasks] = useState()
    const [newTask, setNewTask] = useState("")
    const [deleted, setNewDelete] = useState([])
    const [search, setSearch] = useState("")
    const [list, setList] = useState([])
    const [lists, setLists] = useState(() => {
        const newList = {id: 1, name: "🏠", list: []}
        const savedTodos = localStorage.getItem('Todos')
        const parsedTodos = savedTodos ? JSON.parse(savedTodos) : []
        const hasHomeList = parsedTodos.some(list => Number(list.id) === 1)
        if (hasHomeList) {
          return parsedTodos
        } else {
          return [newList, ...parsedTodos]
        }
    })
    const [showLists, setShowLists] = useState(() => {
        const savedshowLists = localStorage.getItem('ShowList')
        return savedshowLists ? JSON.parse(savedshowLists) : true
    })
    const [currentListID, setCurrentListID] = useState(() => {
        const savedcurrentListID = localStorage.getItem('CurrentListID')
        return savedcurrentListID ? JSON.parse(savedcurrentListID) : 1
    })

    useEffect(() => {
      if (currentListID && lists.length > 0) {
          const foundListObject = lists.find(item => item.id === currentListID)
          
          if (foundListObject) {
              setList(foundListObject.list)
          }
      }
    }, [currentListID, lists])

    useEffect(() => {
        localStorage.setItem('Todos', JSON.stringify(lists))
        localStorage.setItem('CurrentListID', JSON.stringify(currentListID))
        localStorage.setItem('ShowList', JSON.stringify(showLists))
    }, [lists, currentListID, showLists])

    const handleInputChange = (event) => {
        setNewTask(event.target.value)
    }

    const addList = () => {
      if (newTask.trim() !== "") {
        const newListName = { id: crypto.randomUUID(), name: newTask, list: []}
        const updatedList = [...lists, newListName]
        setLists(updatedList)
        setNewTask("")
      }
    }

    const addTask = () => {
        if (newTask.trim() !== "") {
            const newTodoItem = { id: crypto.randomUUID(), text: newTask, done: false }
            const updatedList = [...list, newTodoItem]

            setList([...list, newTodoItem])
            
            setLists(lists.map(n => {
              if (n.id === currentListID) {
                return {...n, list: updatedList}
              } else {
                return n
              }
            }))

            setNewTask("")
        }
    }
    
    const deleteTask = (id) => {
      const taskToDelete = list.find(task => task.id === id)
      const updatedList = list.filter(task => task.id !== id)
      
      if (taskToDelete) {
        setList(updatedList)
        
        setLists(lists.map(n => {
          if (n.id === currentListID) {
            return {...n, list: updatedList}
          } else {
            return n
          }
        }))

        setNewDelete(prev => [...prev, taskToDelete])
      }
    }

    const done = (id) => {
      const updatedList = list.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )

      setList(updatedList)
      
      setLists(lists.map(n => {
        if (n.id === currentListID) {
          return {...n, list: updatedList}
        } else {
          return n
        }
      }))
    }

    const bucket = (id) => {
      if (deleted.length > 4 && currentListID) {
        setNewDelete(prev => prev.slice(1))
      }

      if (deleted.length > 0 && currentListID) {
        const taskToRestore = deleted[deleted.length - 1]
        const updatedList = [...list, taskToRestore]
        setList(updatedList)
        setLists(lists.map(n => n.id === currentListID ? {...n, list: updatedList} : n))
        setNewDelete(prev => prev.slice(0, prev.length - 1))
      }
    }

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(TouchSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    )

    const handleDragEnd = (event) => {
      const { active, over } = event

      if (active.id !== over.id) {
        const oldIndex = list.findIndex(task => task.id === active.id)
        const newIndex = list.findIndex(task => task.id === over.id)
        const updatedList = arrayMove(list, oldIndex, newIndex)

        setList(updatedList)
        setLists(lists.map(n => n.id === currentListID ? {...n, list: updatedList} : n))
      }
    }

    const onClickDeleteList = () => {
      if (currentListID === 1) return
      const updatedLists = lists.filter(n => n.id !== currentListID)
      setCurrentListID(1)
      setLists(updatedLists)
    }

    return (
      <div  className="mx-auto content-center">
        <div className="mx-auto max-w-6xl p-1">
          
          <Title currentList={lists.find(list => list.id === currentListID)} onClickDeleteList={onClickDeleteList} currentListID={currentListID}/>

          <div className="mx-auto p-3 bg-gray-50 rounded-lg shadow-lg">

            <ShowMenu newTask={newTask} handleInputChange={handleInputChange} addTask={addTask} bucket={bucket} addList={addList} setShowLists={() => setShowLists(!showLists)}/>
            <ShowLists lists={lists} setCurrentListID={id => setCurrentListID(id)} showLists={showLists}/>
            <ShowToDoes list={list} sensors={sensors} closestCenter={closestCenter} handleDragEnd={handleDragEnd} verticalListSortingStrategy={verticalListSortingStrategy} done={done} deleteTask={deleteTask}/>

          </div>
          
        </div>
      </div>
    )
}

export default TodoList