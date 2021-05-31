import React, { useState, useReducer, useLayoutEffect, useContext, useRef } from 'react'
import { render, createPortal, unmountComponentAtNode } from 'react-dom'
import { getFileType } from '../common/getFileType'
import useForceUpdate from '../common/useForceUpdate'
import { useStore } from '../store'
import Fa from 'react-fontawesome'

export default function Node(props){
    const [isOpen, setIsOpen] = useState(false);
    const [show, setShow] = useState(true)
    const forceUpdate = useForceUpdate();
    const [state, dispatch] = useStore()
    const { data, renderService } = props
    const { selected, currentDir } = state
    const ifCanEdit = useRef()

    const editFile = async file => {
        await dispatch({type: 'EDIT_FILE', payload: { file, selected }, renderService}) 
    }

    const handleNodeClick = file => {
        if(file.isDir){
            file.children?.map?.((item,index) => {
                item.fn && (file.children[index] = item.fn(item.node));
            })
            show && setShow(false);
            setIsOpen(isOpen => !isOpen)
            dispatch({type: 'SET_CUR_DIR', payload: { file }, renderService})
        }else{
            file.type = getFileType(file);
            editFile(file);
        }
    }

    const handleContextMenu = (e, file) => {
        renderService.buildRightClickMenu(file, (data, node, type) => {
            if(type == 'newFile' || type == 'newDir'){
                data.children.push(node)
                dispatch({type: 'SET_CUR_CHILDREN', payload: {}, renderService})
            }else if(type == 'rename'){
                data.contentEditable = true
                data.toRename = true
                dispatch({type: 'TORENAME', payload: { file: data, selected }, renderService})
                ifCanEdit?.current?.focus?.()
            }else if(type == 'delFile'){
                dispatch({type: 'DEL_FILE', payload: { file: data, selected }, renderService})
                document.getElementById(`node-name-${data.id}`).parentNode.remove()
                document.getElementById(`code-${data.id}`) && document.getElementById(`code-${data.id}`).remove()
                document.querySelector(`.tab-${data.id}`) && document.querySelector(`.tab-${data.id}`).remove()
            }
        }, file.idDir)
        renderService.menu.popup()
    }

    const handleNodeKeyup = (e, file) => {
        if(e.which != 13) return
        handleNodeBlur(e, file)
    }

    const handleNodeBlur = async (e, file) => {
        if(file.contentEditable){
            file.contentEditable = false
            const innerText = e.target.innerText.trim()
            if(file.toRename){
                if(!innerText){
                    return
                }
                const oldName = file.name
                const oldPath = file.path
                file.name = innerText
                file.path = file.path.replace(oldName, innerText)
                file.type = getFileType(file)
                dispatch({type: 'RENAME', payload: { file, selected, oldName, oldPath }, renderService})
            }else{
                if(innerText){
                    file.name = innerText
                    if(file.isDir){
                        file.path += innerText + '/'
                    }else{
                        file.path += innerText
                    }
                    file.type = getFileType(file)
                    await dispatch({type: 'NEW_FILE', payload: { file, selected }, renderService})
                    await handleNodeClick(file)
                }else{
                    e.target.parentNode.remove()
                }
            }
            
        }
    }

    const newFile = (e) => {
        e.stopPropagation();
        console.log('newFile:', currentDir)
        renderService.doNewFileOrDir(currentDir, 'newFile', (data, node, type) => {
            data.children.push(node)
            dispatch({type: 'SET_CUR_CHILDREN', payload: {}, renderService})
        })
    }

    const newDir = (e) => {
        e.stopPropagation();
        console.log('newDir:', currentDir)
        renderService.doNewFileOrDir(currentDir, 'newDir', (data, node, type) => {
            data.children.push(node)
            dispatch({type: 'SET_CUR_CHILDREN', payload: {}, renderService})
        })
    }

    useLayoutEffect(() => {
        if(data.contentEditable){
            ifCanEdit?.current?.focus?.()
        }
        return () => {
            if(data.contentEditable){
                ifCanEdit?.current?.blur?.()
            }
        }
    }, [data])

    useLayoutEffect(() => {
        if(data.isRoot && !data.isDir){
            handleNodeClick(data)
        }
    }, [])

    return (
        <div className='node' style={props.style}>
            <div id={`node-name-${data.id}`} 
                className={['node-name',isOpen ? 'open' : '',`level_${data.level}`, data.current ? 'current' : '', currentDir && currentDir.path == data.path && currentDir.name == data.name ? 'current-dir' : '', selected && selected.findIndex(item => item.id == data.id) >= 0 ? 'selected' : ''].join(' ')} 
                style={{cursor: 'pointer', paddingLeft: data.level * 5 + 'px'}} 
                contentEditable={data.contentEditable}
                suppressContentEditableWarning={data.contentEditable}
                onClick={e => { handleNodeClick(data) }}
                onContextMenu={e => { handleContextMenu(e, data) }}
                ref={ifCanEdit}
                onBlur={e => { handleNodeBlur(e, data) }}
                onKeyPress={e => { handleNodeKeyup(e, data) }}>
                    <span style={{display: data.contentEditable ? 'none' : 'flex'}} className={['icon',`icon-${getFileType(data)}`].join(' ')}><img src={`../assets/node/file-${getFileType(data)}.png`}/></span>
                    <span className='text'>{data.name}</span>
                {data.isRoot ? <div className="actions">
                    <span className="newFile" title='新建文件' onClick={e => { newFile(e) }}><svg t="1621559367828" className="icon2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1676" width="16" height="16"><path d="M914.285714 950.857143h-804.571428V73.142857h585.142857v204.8h219.428571V950.857143z m-731.428571-65.828572h658.285714V343.771429h-219.428571V138.971429h-438.857143v746.057142z" fill="#ffffff" p-id="1677"></path><path d="M863.085714 336.457143l-7.314285-14.628572-212.114286-197.485714 51.2-51.2 29.257143 21.942857 190.171428 182.857143zM621.714286 672.914286H365.714286v-73.142857h292.571428v73.142857z" fill="#ffffff" p-id="1678"></path><path d="M548.571429 775.314286h-73.142858V497.371429h73.142858v29.257142z" fill="#ffffff" p-id="1679"></path></svg></span>
                    <span className="newDir" title="新建目录" onClick={e => { newDir(e) }}><svg t="1621559398768" className="icon2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1879" width="20" height="20"><path d="M484 443.1V528h-84.5c-4.1 0-7.5 3.1-7.5 7v42c0 3.8 3.4 7 7.5 7H484v84.9c0 3.9 3.2 7.1 7 7.1h42c3.9 0 7-3.2 7-7.1V584h84.5c4.1 0 7.5-3.2 7.5-7v-42c0-3.9-3.4-7-7.5-7H540v-84.9c0-3.9-3.1-7.1-7-7.1h-42c-3.8 0-7 3.2-7 7.1z" p-id="1880" fill="#ffffff"></path><path d="M880 298.4H521L403.7 186.2c-1.5-1.4-3.5-2.2-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z" p-id="1881" fill="#ffffff"></path></svg></span>
                </div> : null}
            </div>
            {show ? null : data.isDir && data.children.map(file => {
                return <Node data={file || {}} style={{display: isOpen ? 'block' : 'none'}} key={file.id} renderService={renderService}/>
            })}
        </div>
    )
}
