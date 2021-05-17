import setting from './fileTypeSetting'

export const getFileType = file => {
    if(file.isDir){
        return 'dir'
    }else{
        const item = setting.find(item => item.test.test(file.name))
        return item?.type || 'default'
    }
}