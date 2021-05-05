import React, {useState, useReducer} from 'react'
import './App.global.css'
import './style/Layout.global.css'
import Navigation from './layout/Navigation'
import Main from './layout/Main'
import { Store } from './store'

export default function App(props) {
  
  return (
      <>
        {props.data ? <div className="layout">
          <Store>
            <Navigation {...props}/>
            <Main></Main>
          </Store>
          </div> : <div className="open-file-or-dir"><div className="open-file-or-dir-wrap" onClick={props.onOpen}><svg t="1619016756649" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3910" width="200" height="200"><path d="M1015.456 273.056c-8.544-12.8-21.344-17.056-34.144-17.056h-196.256L627.2 98.144c-8.544-8.544-17.056-12.8-29.856-12.8H42.688C17.088 85.344 0.032 102.4 0.032 128v768c0 25.6 17.056 42.656 42.656 42.656h810.656c21.344 0 38.4-12.8 42.656-34.144l128-597.344c0-12.8 0-25.6-8.544-34.144z m-930.112-102.4h494.944L665.632 256H170.688c-21.344 0-38.4 12.8-42.656 34.144l-42.656 204.8V170.688zM819.2 853.344H93.856l110.944-512h725.344l-110.944 512z" p-id="3911" fill="#999999"></path></svg><span className="open-file">打开文件或文件夹</span></div></div>
        }
      </>
      
  )
}


