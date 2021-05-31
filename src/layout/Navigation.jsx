import React, { useLayoutEffect, useRef } from 'react'
import Node from '../components/Node'

export default function Navigation(props){
    const ref = useRef();
    const maxWidth = 500;
    const minWidth = 200;
    let x = 0;

    const mouseMove = e => {
        e = e || window.event
        let width = e.clientX - x;
        width = width < minWidth ? minWidth : width;
        width = width > maxWidth ? maxWidth : width;
        ref.current.style.width = width + 'px';
    }

    const mouseUp = e => {
        document.onmousemove = null;
        document.onmouseup = null;
        localStorage.setItem('naviWidth', ref.current.style.width)
    }

    const mouseDown = e => {
        e = e || window.event;
        e.preventDefault();
        x = e.clientX - ref.current.offsetWidth;
        document.onmousemove = mouseMove;
        document.onmouseup = mouseUp;
    }

    useLayoutEffect(() => {
        let naviWidth = localStorage.getItem('naviWidth')
        if(naviWidth){
            ref.current.style.width = naviWidth;
        }

        const resizeHandle = ref.current.querySelector('.resize-handle');

        resizeHandle.addEventListener('mousedown', mouseDown, false)
        return () => {
            resizeHandle.removeEventListener('mousedown', mouseDown, false)
        };
    }, [])
    
    return (
        <div className="navigation" ref={ref}>
            <div className="tools">
                <div className="logo"><img src="../assets/logo.png" alt=""/></div>
            </div>
            <div className="explorer">
                <p className="e-title">EXPLORER</p>
                <Node {...props}/>
            </div>
            <div className="resize-handle"></div> {/* 鼠标拖拽手柄 */}
        </div>
    )
}
