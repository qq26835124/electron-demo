import React, { useState, useReducer, useLayoutEffect, useContext } from 'react'
import CodeEditor from '../components/CodeEditor'
import { useStore } from '../store'
import useForceUpdate from '../common/useForceUpdate'

export default function Main(props){

    const forceUpdate = useForceUpdate();
    const [state, dispatch] = useStore()
    const { selected } = state;

    console.log('props:',props)
    console.log('selected:',selected)

    const handleTabChange = async file => {
        if(file.current) return;
        await dispatch(({type: 'UPDATE_SELECTED', file, selected}))
    }

    const handleTabClose = async file => {
        await dispatch(({type: 'CLOSE_FILE', file, selected}))
    }

    const setIsChange = async (isChange, id) => {
        const file = selected.find(item => item.id == id)
        await dispatch({type: 'SET_ISCHANGE', file, selected, isChange, id})
    }

    return (
        <div className="main">
            <div className="file-content">
                <ul className="file-tabs">
                    {selected ? selected.map(item => {
                        return <li key={item.id} uid={item.id} className={['tab', item.current ? 'current' : '', 'tab-' + item.id, item.isChange ? 'is-change' : ''].join(' ')} title={item.path} onClick={handleTabChange.bind(this,item)}><span>{item.name}</span><span className="close" onClick={handleTabClose.bind(this,item)}></span></li>
                    }) : null}
                </ul>
                <div className="file-contents">
                    {selected ? selected.map(item => {
                        return <CodeEditor key={item.id} uid={item.id} className={item.type} content={item.content} current={item.current} setIsChange={setIsChange}></CodeEditor>
                    }) : null}
                </div>
            </div>
        </div>
    )
}
