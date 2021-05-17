import React, { useLayoutEffect, useReducer, useRef, useState } from 'react'
// import * as monaco from 'monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'

/**
 * 编辑器默认配置
 */
let defaultOpts = {
    value: '',
    theme: 'vs-dark',
    roundedSelection: false,
    autoSize: true,
    autoIndent: true
}

/**
 * 初始化编辑器
 * @param {编辑器容器所属对象} ref 
 * @param {当前编辑器内容对应的属性值} opts 
 */
const init = (ref, opts, props, callback) => {
    ref.current.innerHTML = '';
    defaultOpts = Object.assign(defaultOpts, opts);
    const model=monaco.editor.createModel(defaultOpts.value, defaultOpts.language);
    let monacoEditor = monaco.editor.create(ref.current, {...defaultOpts, model})
    model.onDidChangeContent(() => {
        let value = monacoEditor.getValue() 
        callback?.(value)
    })
    return model;
}

export default function CodeEditor(props){
    const container = useRef();
    const { uid, content, className, current, style } = props
    useLayoutEffect(() => {
        // 非图片文本内容才加载编辑器
        if(className != 'img'){
            let model = init(container, {
                value: content,
                language: className
            }, props, value => {
                if(props.oldContent == value){
                    props?.setIsChange?.(uid, value, content)
                }else{
                    props?.setIsChange?.(uid, value, content)
                }
            });
            (() => {
                return model.dispose();
            })
        }
    }, [])
    return (
        <>
            {className == 'img' 
                ? <div className={['img-box',current ? 'current' : ''].join(' ')}><img src={content} alt={content}/></div> 
                : <div ref={container} id={`code-${uid}`} className={['code',current ? 'current' : ''].join(' ')} style={style}></div>
            }
        </>
    )
}