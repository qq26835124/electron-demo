class MainService{
    constructor(dialog, mainWindow){
        this.dialog = dialog
        this.mainWindow = mainWindow
    }
    // 新建文件
    newFile(){
        console.log('点击了File')
    }

    // 打开文件或文件夹
    openFile(){
        this.dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory']
        }).then(files => {
            files && this.mainWindow.emit('selected-files', files)
        })
    }

    // 保存文件
    saveFile(){
        this.mainWindow.emit('doSaveFile')
    }
}

export {
    MainService
}