import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { ipcRenderer } from 'electron'
import fs from 'fs'
const rootPath = '/Users/jiangyichun/Documents'
const rootName = 'Documents'

const transData = (node, cb) => {
    if(!node.level || !node.id) return
    fs.stat(node.path, (err, stats) => {
        if(stats && stats.isDirectory()){
            try {
                node.path += '/'
                const subDir = fs.readdirSync(node.path)
                subDir.forEach((subName,index) => {
                    let subNode = {
                        path: node.path + subName,
                        name: subName,
                        level: node.level+1,
                        children: [],
                        id: `${node.level + 1}_${index}`,
                        isOpen: node.isOpen,
                        current: false
                    }
                    subNode.isDir = fs.statSync(subNode.path) && fs.statSync(subNode.path).isDirectory() || false;
                    // node.children && node.children.push(subNode)
                    // transData(subNode)
                    node.children && node.children.push({fn: transData, node: subNode})
                })
            } catch (error) {
                
            }
            
        }else if(stats && stats.isFile()){
            
        }else{
            console.log('文件未知错误!')
            return
        }
        cb && cb(node)
    })
    return node;
}

let node = {
    path: rootPath,
    name: rootName,
    id: 1,
    level: 1,
    children: [],
    isDir: fs.statSync(rootPath) && fs.statSync(rootPath).isDirectory() || false,
    isOpen: false,
    current: false
}

transData(node, data => {
    console.log('data:',data)
    render(
        <App data={data} isOpen={node.isOpen}/>, document.getElementById('root')
    )
})

// 在渲染进程中
ipcRenderer.invoke('main-action', 'textContent')
