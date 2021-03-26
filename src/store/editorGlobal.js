import { useRef } from 'react'

class Editor{
    constructor(props){
        this.opens = [];
        this.data = props;
        this.listeners = [];
    }

    setOpens = (open) => {
        if(!open.type) return;
        this.opens.forEach(item => {
            item.current = false;
        })
        open.current = true;
        if(open.type == 'img'){
            open.content = open.path;
        }else{
            try {
                const data = fs.readFileSync(open.path, 'utf-8') || '';
                open.content = data;
            } catch (error) {
                
            }
        }
        
        this.opens.push(open);
        this.data = open;
    }

    // 订阅 组件更新
    subscribe = (listener) => {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((lis) => lis !== listener);
        };
    }

    getEditor = () => {
        const retFuncs = [
            'setOpens',
            'subscribe'
        ];
        const obj = {
            opens: this.opens,
            data: this.data
        };
        retFuncs.forEach(func => {
            obj[func] = this[func];
        })
        return obj;
    }
}

export function useEditorGlobal(data){
    return new Editor(data);
} 