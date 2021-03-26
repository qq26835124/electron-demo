import React, { useState, useReducer, useLayoutEffect, useContext } from 'react'
import CodeEditor from '../components/CodeEditor'
import {useGlobalStore} from '../store'
import { SelectedContext } from '../context'
import useForceUpdate from '../common/useForceUpdate'

export default function Main(props){

    const reducer = useGlobalStore();
    const { selected, setSelected } = useContext(SelectedContext);

    const [state, dispatch] = useReducer(reducer, {...props})
    const forceUpdate = useForceUpdate();

    console.log('props:',props)
    console.log('selected:',selected)

    const rerenderSelectedStyle = (selected, file, closeFile) => {
        if(!file) return;
        document.querySelectorAll('.node-name')?.forEach(item => {
            item.classList.remove('current');
        })
        let id = 'node-name-' + file.id
        document.querySelector('#' + id)?.classList?.add?.('selected');
        document.querySelector('#' + id)?.classList?.add?.('current');
    }

    const handleTabChange = file => {
        if(file.current) return;
        dispatch(({type: 'UPDATE_SELECTED', file, selected}))
        forceUpdate()
        // rerenderSelectedStyle(selected)
        props?.onRightChange?.(selected)
    }

    const handleTabClose = file => {
        dispatch(({type: 'CLOSE_FILE', file, selected, setSelected}))
        forceUpdate()
        // rerenderSelectedStyle(selected)
        props?.onRightChange?.(selected)
    }

    return (
        <div className="main">
            <div className="file-content">
                <ul className="file-tabs">
                    {selected ? selected.map(item => {
                        return <li key={item.id} className={['tab', item.current ? 'current' : ''].join(' ')} title={item.path} onClick={handleTabChange.bind(this,item)}><span>{item.name}</span><span className="close" onClick={handleTabClose.bind(this,item)}></span></li>
                    }) : null}
                </ul>
                <div className="file-contents">
                    {selected ? selected.map(item => {
                        return <CodeEditor key={item.id} className={item.type} content={item.content} current={item.current}></CodeEditor>
                    }) : null}
                </div>
            </div>
        </div>
    )
}
