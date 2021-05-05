import React, { useState, useReducer, useLayoutEffect, useContext } from 'react'
import { getFileType } from '../common/getFileType'
import useForceUpdate from '../common/useForceUpdate'
import { useStore } from '../store'
import Fa from 'react-fontawesome'

export default function Node(props){
    const [isOpen, setIsOpen] = useState(false);
    const [show, setShow] = useState(true)
    const forceUpdate = useForceUpdate();
    const [state, dispatch] = useStore()
    const { data } = props
    const { selected } = state

    const openFile = async file => {
        await dispatch({type: 'OPEN_FILE', file, selected}) 
        forceUpdate();
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
            openFile(file);
        }
    }

    return (
        <div className='node' style={props.style}>
            <div id={`node-name-${data.id}`} 
                className={['node-name',isOpen ? 'open' : '',`level_${data.level}`, data.current ? 'current' : '', selected && selected.findIndex(item => item.id == data.id) >= 0 ? 'selected' : ''].join(' ')} 
                style={{cursor: 'pointer', paddingLeft: data.level * 5 + 'px'}} 
                onClick={handleNodeClick.bind(this,data)}>
                    <span className={['icon',`icon-${getFileType(data)}`].join(' ')}><img src={`../assets/node/file-${getFileType(data)}.png`}/></span>
                    <span className='text'>{data.name}</span>
                {data.isRoot ? <div className="actions">
                    <span className="newFile" title='新建文件'><Fa name='file-o'></Fa></span>
                    <span className="newDir" title="新建目录"><Fa name='folder-o'></Fa></span>
                </div> : null}
            </div>
            {show ? null : data.isDir && data.children.map(file => {
                return <Node data={file || {}} style={{display: isOpen ? 'block' : 'none'}} key={file.id} onOpenFile={state.onOpenFile}/>
            })}
        </div>
    )
}
