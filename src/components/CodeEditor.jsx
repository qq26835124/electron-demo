import React, { useLayoutEffect, useReducer, useRef, useState } from 'react'
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
const init = (ref, opts, props, callback) => {
    ref.current.innerHTML = '';
    defaultOpts = Object.assign(defaultOpts, opts);
    const model=monaco.editor.createModel(defaultOpts.value, defaultOpts.language);
    let monacoEditor = monaco.editor.create(ref.current, {...defaultOpts, model})
    model.onDidChangeContent(() => {
        // console.log('monacoEditor->value:', monacoEditor.getValue())
        let value = monacoEditor.getValue() 
        callback?.(value)
    })
    return model;
}

export default function CodeEditor(props){
    const container = useRef();
    const { uid, content, className, current, style } = props
    const [ isChange, setIsChange ] = useState(false);
    useLayoutEffect(() => {
        // 非图片文本内容才加载编辑器
        if(className != 'img'){
            const model = init(container, {
                value: content,
                language: className
            }, props, value => {
                if(props.content == value){
                    setIsChange(false)
                    document.querySelector('.tab-' + uid).classList.remove('is-change')
                }else{
                    setIsChange(true)
                    document.querySelector('.tab-' + uid).classList.add('is-change')
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
                : <div ref={container} id={`code-${uid}`} className={['code',current ? 'current' : '', isChange ? 'is-change' : ''].join(' ')} style={style}></div>
            }
        </>
    )
}