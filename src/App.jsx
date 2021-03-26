import React, {useState, useReducer} from 'react'
import './App.global.css'
import './style/Layout.global.css'
import Aside from './layout/Aside'
import Main from './layout/Main'
// import { useGlobalStore } from './store'
import { SelectedContext } from './context'

export default function App(props) {
  // const { reducer } = useGlobalStore()

  const [selected, setSelected] = useState([])

  // const [state, dispatch] = useReducer(reducer, {
  //   data: props.data
  // })

  const [rightData,setRightData] = useState({});

  const onOpenFile = data => {
    setRightData(data);
  }

  const onRightChange = (selected, file, closeFile) => {
    console.log('right->change=selected:', selected)
    console.log('right->change=file:', file)
    console.log('right->change=closeFile:', closeFile)
    setSelected(selected)
  }
  
  return (
      <div className="layout">
          <SelectedContext.Provider value={{selected, setSelected}}>
            <Aside {...props} onOpenFile={onOpenFile}/>
            <Main {...rightData} onRightChange={onRightChange}></Main>
          </SelectedContext.Provider>
      </div>
  )
}


