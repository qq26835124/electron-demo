import { ipcRenderer, remote } from 'electron'
import fs from 'fs'
const { dialog, Menu, MenuItem } = remote
const remoteMainWindow = remote.getCurrentWindow()

class RenderService{

    constructor(){
        this.menu = null
        this.menuData = null
    }

    /**
     * 创建右键菜单
     */
    buildRightClickMenu(data, callback){
        const template = data.isDir 
            ? this.buildRightClickTemplate(callback).filter(item => item.dirMenu) 
            : this.buildRightClickTemplate(callback).filter(item => item.fileMenu)
        this.menu = new Menu()
        template.forEach(item => {
            this.menu.append(new MenuItem(item))
        })
        this.menuData = data
    }

    /**
     * 右键菜单模板
     */
    buildRightClickTemplate(callback) {
        return [
        {
            dirMenu: true,
            label: '新建文件',
            click: e => {
                console.log('新建文件:',this.menuData)
                this.doNewFileOrDir(this.menuData, 'newFile', callback)
            }
        },
        {
            dirMenu: true,
            label: '新建文件夹',
            click: e => {
                console.log('新建文件夹:',this.menuData)
                this.doNewFileOrDir(this.menuData, 'newDir', callback)
            }
        },
        {
            fileMenu: true,
            dirMenu: true,
            label: '删除',
            click: e => {
                callback && callback(this.menuData, null, 'delFile')
            }
        },
        {
            fileMenu: true,
            dirMenu: true,
            label: '重命名',
            click: e => {
                callback && callback(this.menuData, null, 'rename')
            }
        }
        ]
    }

    /**
     * 新建文件或文件夹具体逻辑
     * @param {Object} data 
     */
    doNewFileOrDir(data, type, callback){
        const name = ''
        let node = {
            isRoot: false,
            path: data.path + name,
            name,
            id: `${data.level + 1}_${data.children.length}`,
            level: `${data.level + 1}`,
            children: [],
            isDir: type == 'newDir' ? true : false,
            isOpen: false,
            current: false,
            contentEditable: true
        }
        callback && callback(data, node, type)
    }

    /**
     * 调用主进程
     */
    invoke(){
        ipcRenderer.invoke('main-action')
    }

    /**
     * 打开文件或文件夹
     */
    openFile(){
        dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory']
        }).then(files => {
            files && remoteMainWindow.emit('selected-files', files)
        })
    }

    /**
     * 编辑文件
     * @param {*} payload 
     */
    editFile(payload){
        const { file, selected } = payload
        const index = selected?.findIndex(it => it.id == file.id); 
        selected.forEach(item => {
            item.current = false;
        }); 
        file.current = true;
        if(file.type == 'img'){
            file.content = file.path;
            if(index >= 0){
                selected[index].current = true
            }else{
                selected.push(file);
            }            
        }else{
            try {
                const data = fs.readFileSync(file.path, 'utf-8') || '';
                file.content = data;
                if(index >= 0){
                    selected[index].current = true
                }else{
                    selected.push(file);
                } 
            } catch (error) {
                console.log('读取文件失败')
            }
            
        }
        return {
            file,
            selected
        }
    }

    /**
     * 更新当前打开文件列表
     * @param {*} payload 
     */
    updateSelected(payload){
        const { file, selected } = payload
        selected.forEach(it => {
            if(it.id == file.id){
                it.current = true;
            }else{
                it.current = false;
            }
        })
        return {
            file, 
            selected
        }
    }

    /**
     * 关闭已打开文件
     * @param {*} payload 
     */
    closeFile(payload){
        const { file, selected } = payload
        const index = selected?.findIndex(it => it.id == file.id); 
        selected.forEach(item => {
            item.current = false;
        })
        index >= 0 && selected.splice(index, 1);  
        selected[selected.length - 1] && (selected[selected.length - 1].current = true)
        return {
            file: selected[selected.length - 1], 
            selected
        }
    }

    /**
     * 当前文件是否有修改
     * @param {*} payload 
     */
    setIsChange(payload){
        const { file, selected, id, content, oldContent } = payload
        selected.forEach(item => {
            if(item.id == id){
                item.content = content;
                !item.oldContent && (item.oldContent = oldContent)
            }
        })
        file.content = content;
        !file.oldContent && (file.oldContent = oldContent)
        return {
            file, 
            selected
        }
    }

    /**
     * 新建文件或文件夹
     * @param {*} payload 
     */
    newFile(payload){
        const { file, selected } = payload
        if(file.isDir){
            fs.mkdirSync(file.path)
        }else{
            fs.writeFile(file.path, file.content, 'utf8', (err) => {
                if (err) throw err;
            });
        }
        return {
            file,
            selected
        }
    }

    /**
     * 保存文件修改
     * @param {*} payload 
     */
    saveFile(payload){
        const { file, selected } = payload
        selected.forEach(item => {
            if(item.current){
                item.oldContent = item.content
                fs.writeFile(item.path, item.content, 'utf8', (err) => {
                    if (err) throw err;
                });
            }  
        })
        file.oldContent = file.content
        return {
            file,
            selected
        }
    }

    /**
     * 重命名
     * @param {*} payload 
     */
    rename(payload){
        const { file, selected, oldName, oldPath } = payload
        fs.renameSync(oldPath, file.path)
        return {
            file, 
            selected
        }
    }

    /**
     * 删除文件或文件夹
     * @param {*} payload 
     */
    delFile(payload){
        const { file, selected } = payload
        const index = selected?.findIndex(it => it.id == file.id); 
        if(file.isDir){
            fs.rmdirSync(file.path, { recursive: true })
        }else{
            fs.unlinkSync(file.path)
        }
        selected.splice(index, 1)
        return {
            file,
            selected
        }
    }

    /**
     * 初始化目录
     * @param {*} filePath 
     * @param {*} callback 
     */
    initDir(filePath, callback){
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
        this.generateDirTree(node, data => {
            console.log('data:',data)
            callback && callback(node, data)
        })
    }

    /**
     * 生成目录树
     * @param {*} node 
     * @param {*} callback 
     */
    generateDirTree(node, callback){
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
                        // this.generateDirTree(subNode)
                        node.children && node.children.push({fn: this.generateDirTree.bind(this), node: subNode})
                    })
                } catch (error) {
                    
                }
                
            }else if(stats && stats.isFile()){
                
            }else{
                console.log('文件未知错误!')
                return
            }
            callback && callback(node)
        })
        return node;
    }

    /**
     * 选择文件
     * @param {*} callback 
     */
    selectedFiles(callback){
        ipcRenderer.on('selected-files', (event, files) => {
            console.log('ffiles:',files)
            this.initDir(files.filePaths[0], (node, data) => {
                callback && callback(node, data)
            })
        })
    }

    /**
     * 保存文件
     */
    doSaveFile(callback){
        ipcRenderer.on('doSaveFile', e => {
            callback && callback(e)
        })
    }
    
}

export {
    RenderService
}