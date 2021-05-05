import React, { useLayoutEffect } from 'react'
import Node from '../components/Node'
import { useStore } from '../store'

export default function Navigation(props){
    return (
        <div className="navigation">
            <div className="tools">
                
            </div>
            <div className="explorer">
                <p className="e-title">EXPLORER</p>
                <Node {...props}/>
            </div>
        </div>
    )
}
