import React, { useLayoutEffect, useReducer, useRef } from 'react'
import * as monaco from 'monaco-editor'

/**
 * 编辑器默认配置
 */
let defaultOpts = {
    value: '',
    theme: 'vs-dark',
    roundedSelection: false,
    autoIndent: true
}

/**
 * 初始化编辑器
 * @param {编辑器容器所属对象} ref 
 * @param {当前编辑器内容对应的属性值} opts 
 */
const init = (ref, opts) => {
    ref.current.innerHTML = '';
    defaultOpts = Object.assign(defaultOpts, opts);
    let monacoEditor = monaco.editor.create(ref.current, defaultOpts)
    monacoEditor.onDidChangeModelContent(() => {
        console.log('monacoEditor->value:', monacoEditor.getValue())
    })
}

export default function CodeEditor(props){
    const container = useRef();
    useLayoutEffect(() => {
        // 非图片文本内容才加载编辑器
        if(props.className != 'img'){
            init(container, {
                value: props.content,
                language: props.className
            });
        }
    }, [])
    return (
        <>
            {props.className == 'img' 
                ? <div className={['img-box',props.current ? 'current' : ''].join(' ')}><img src={props.content} alt={props.content}/></div> 
                : <div ref={container} id={`code-${props.id}`} className={['code',props.current ? 'current' : ''].join(' ')} style={props.style}></div>
            }
        </>
    )
}