import React, { useLayoutEffect } from 'react'
import Node from '../components/Node'

export default function Aside(props){

    return (
        <div className="aside">
            {/* <h1>electron-react-boilerplate</h1> */}
            <div className="explorer">
                <p className="e-title">EXPLORER</p>
                <Node {...props}/>
            </div>
        </div>
    )
}
