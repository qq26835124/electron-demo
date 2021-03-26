import { useState, useEffect } from 'react'
import fs from 'fs'
const selected = [];

export default function useOpenFile() {
    const [file, setFile] = useState({})

    const showContent = (file, fileType) => {
        if(!fileType) return;
        file.type = fileType;
        if(file.type){
            selected.forEach(item => {
                item.current = false;
            });  
            file.current = true;  
        }
        
        if(fileType == 'img'){
            file.content = file.path;
            setFile(file)
            selected.push(file);
        }else{
            try {
                const data = fs.readFileSync(file.path, 'utf-8') || '';
                file.content = data;
                setFile(file)
                selected.push(file); 
            } catch (error) {
                console.log('读取文件失败')
            }
            
        }
        
    }
    
    return [file, showContent, selected]
}