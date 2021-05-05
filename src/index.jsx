import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import App from './App'
import { ipcRenderer } from 'electron'
import fs from 'fs'

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

/**
 * 初始化目录
 * @param {读取的文件路径} filePath 
 */
const initDir = filePath => {
    if(!filePath) return;
    const rootPath = filePath;
    const rootName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
    let node = {
        isRoot: true,
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
        // 先卸载根节点
        unmountComponentAtNode(document.getElementById('root'))
        render(
            <App data={data} isOpen={node.isOpen}/>, document.getElementById('root')
        )
    })
}

const onOpen = () => {
    console.log('onOpen')
    ipcRenderer.send('openDialog')
}

// 在渲染进程中
ipcRenderer.invoke('main-action')

// 打开文件
ipcRenderer.on('selected-files', (event, files) => {
    console.log('ffiles:',files)
    initDir(files.filePaths[0])
})

render(
    <App onOpen={onOpen}/>,
    document.getElementById('root')
)

