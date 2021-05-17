import React, { useState, useReducer, useLayoutEffect, useContext } from 'react'
import CodeEditor from '../components/CodeEditor'
import { useStore } from '../store'
import useForceUpdate from '../common/useForceUpdate'

export default function Main(props){

    const { renderService } = props
    const forceUpdate = useForceUpdate();
    const [state, dispatch] = useStore()
    const { selected } = state;

    console.log('props:',props)
    console.log('selected:',selected)

    const handleTabChange = async file => {
        if(file.current) return;
        await dispatch({type: 'UPDATE_SELECTED', payload: { file, selected }, renderService})
    }

    const handleTabClose = async (e, file) => {
        e.stopPropagation();
        await dispatch({type: 'CLOSE_FILE', payload: { file, selected }, renderService})
    }

    const setIsChange = async (id, content, oldContent) => {
        const file = selected.find(item => item.id == id)
        await dispatch({type: 'SET_ISCHANGE', payload: { file, selected, id, content, oldContent }, renderService})
    }

    useLayoutEffect(() => {
        // 文件保存
        renderService.doSaveFile(async e => {
            const file = selected.find(item => item.current)
            await dispatch({type: 'SAVE_FILE', payload: { file, selected }, renderService})
        })
    }, [])

    return (
        <div className="main">
            <div className="file-content">
                <ul className="file-tabs">
                    {selected ? selected.map(item => {
                        return <li key={item.id} uid={item.id} className={['tab', item.current ? 'current' : '', 'tab-' + item.id, item.oldContent !== undefined && item.content != item.oldContent ? 'is-change' : ''].join(' ')} title={item.path} onClick={handleTabChange.bind(this,item)}><span>{item.name}</span><span className="close" onClick={e => { handleTabClose(e, item) }}></span></li>
                    }) : null}
                </ul>
                <div className="file-contents">
                    {selected ? selected.map(item => {
                        return <CodeEditor key={item.id} uid={item.id} className={item.type} content={item.content} oldContent={item.oldContent} current={item.current} setIsChange={setIsChange}></CodeEditor>
                    }) : null}
                </div>
            </div>
        </div>
    )
}
