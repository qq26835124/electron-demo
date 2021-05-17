import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import App from './App'
import { Store } from './store'
import { ipcRenderer } from 'electron'
import { RenderService } from './render-services'

const renderService = new RenderService()

// 在渲染进程中
renderService.invoke()

// 打开文件并渲染界面
renderService.selectedFiles((node, data) => {
    // 先卸载根节点
    unmountComponentAtNode(document.getElementById('root'))
    render(
        <Store>
            <App data={data} isOpen={node.isOpen} renderService={renderService}/>
        </Store>
        , document.getElementById('root')
    )
})

render(
    <App onOpen={renderService.openFile.bind(renderService)}/>,
    document.getElementById('root')
)

