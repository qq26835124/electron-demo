import React, { useLayoutEffect, useReducer } from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/ocean.css'
import lineNumbers from '../utils/lineNumbers.js'
import '../style/LineNumbers.global.css'

export default function CodeEditor(props){
    useLayoutEffect(() => {
        lineNumbers(hljs,document)
        hljs.highlightAll();
        hljs.initLineNumbersOnLoad();
        document.querySelector(`#code-${props.id}`)?.querySelectorAll("pre code")?.forEach(block => {
            try{
                hljs.highlightBlock(block)
            }catch(e){
                console.log(e)
            }
        })
    }, [])
    return (
        <>
            {props.className == 'img' 
                ? <div className={['img-box',props.current ? 'current' : ''].join(' ')}><img src={props.content} alt={props.content}/></div> 
                : <div id={`code-${props.id}`} className={['code',props.current ? 'current' : ''].join(' ')} style={props.style} suppressContentEditableWarning contentEditable="true">
                    <pre><code className={props.className}>{props.content}</code></pre>
            </div>}
        </>
    )
}