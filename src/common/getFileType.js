
export const getFileType = file => {
    if(file.isDir){
        return 'dir'
    }else{
        if(/\.js$/.test(file.name)){
            return 'javascript'
        }else if(/\.ts$/.test(file.name)){
            return 'typescript'
        }else if(/\.jsx|\.tsx$/.test(file.name)){
            return 'react'
        }else if(/\.html$/.test(file.name)){
            return 'html'
        }else if(/\.css$/.test(file.name)){
            return 'css'
        }else if(/\.vue$/.test(file.name)){
            return 'vue'
        }else if(/\.json$/.test(file.name)){
            return 'json'
        }else if(/\.txt$/.test(file.name)){
            return 'txt'
        }else if(/\.(jpg|jpeg|png|gif|svg|JPG|JPEG|PNG|GIF|SVG)$/.test(file.name)){
            return 'img'
        }else{
            return 'default'
        }
    }
}