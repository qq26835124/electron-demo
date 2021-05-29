
class MainService{
    constructor(dialog, mainWindow){
        this.dialog = dialog
        this.mainWindow = mainWindow
    }
    /**
     * 新建文件
     */
    newFile(){
        console.log('点击了File')
    }

    /**
     * 打开文件或文件夹
     */
    openFile(){
        this.dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory']
        }).then(files => {
            files && this.mainWindow.emit('selected-files', files)
        })
    }

    /**
     * 保存文件
     */
    saveFile(){
        this.mainWindow.emit('doSaveFile')
    }

    /**
     * 关于
     */
    about(){
        this.dialog.showMessageBox({
            message: '作者：Jyc\nQQ：26835124\n微信：18201709592\n手机：微信同号'
        })
    }
}

export {
    MainService
}