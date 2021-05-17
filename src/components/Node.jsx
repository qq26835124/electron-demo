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
    const { selected } = state
    const ifCanEdit = useRef()

    const editFile = async file => {
        await dispatch({type: 'EDIT_FILE', payload: { file, selected }, renderService}) 
        // forceUpdate();
    }

    const handleNodeClick = file => {
        if(file.isDir){
            file.children?.map?.((item,index) => {
                item.fn && (file.children[index] = item.fn(item.node));
            })
            show && setShow(false);
            setIsOpen(isOpen => !isOpen)
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
        })
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
                className={['node-name',isOpen ? 'open' : '',`level_${data.level}`, data.current ? 'current' : '', selected && selected.findIndex(item => item.id == data.id) >= 0 ? 'selected' : ''].join(' ')} 
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
                    <span className="newFile" title='新建文件'><Fa name='file-o'></Fa></span>
                    <span className="newDir" title="新建目录"><Fa name='folder-o'></Fa></span>
                </div> : null}
            </div>
            {show ? null : data.isDir && data.children.map(file => {
                return <Node data={file || {}} style={{display: isOpen ? 'block' : 'none'}} key={file.id} renderService={renderService}/>
            })}
        </div>
    )
}
