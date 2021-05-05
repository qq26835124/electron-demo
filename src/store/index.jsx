import React, { createContext, useContext, useReducer } from 'react'
import fs from 'fs'

const actionTypes = {
    INIT_DATA: 'INIT_DATA',
    OPEN_FILE: 'OPEN_FILE',
    UPDATE_SELECTED: 'UPDATE_SELECTED',
    SET_SELECTED: 'SET_SELECTED',
    CLOSE_FILE: 'CLOSE_FILE',
    SET_ISCHANGE: 'SET_ISCHANGE'
}

// export let selected = []

export const initialState = {
    data: null,
    selected: []
}

export function reducer(state = initialState, action){
    let { file, selected } = action
    let index = selected.findIndex(it => it.id == file.id);
    switch (action.type) {
        case actionTypes.INIT_DATA: 
            return {
                data: file,
                selected
            };
        case actionTypes.SET_SELECTED: 
            return state;
        case actionTypes.OPEN_FILE: 
            selected.forEach(item => {
                item.current = false;
            }); 
            file.current = true;
            if(file.type == 'img'){
                file.content = file.path;
                index < 0 && selected.push(file);
                state.data = file;
            }else{
                try {
                    const data = fs.readFileSync(file.path, 'utf-8') || '';
                    file.content = data;
                    index < 0 && selected.push(file); 
                } catch (error) {
                    console.log('读取文件失败')
                }
                
            }
            return {
                data: file,
                selected
            };
        case actionTypes.UPDATE_SELECTED: 
            selected.forEach(it => {
                if(it.id == file.id){
                    it.current = true;
                }else{
                    it.current = false;
                }
            })
            return {
                data: file,
                selected
            };
        case actionTypes.CLOSE_FILE:
            index >= 0 && selected.splice(index, 1)
            selected.forEach(item => {
                item.current = false;
            });  
            selected[selected.length - 1] && (selected[selected.length - 1].current = true)
            return {
                data: selected[selected.length - 1],
                selected
            };
        case actionTypes.SET_ISCHANGE: 
            const { isChange, id } = action
            selected.forEach(item => {
                if(item.id == id){
                    item.isChange = isChange
                }
            })
            return {
                data: file,
                selected
            }
        default:
            return state;
    }
}

export const StoreCtx = createContext(initialState)

export function Store(props){
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <StoreCtx.Provider value={[state, dispatch]} >
            {props.children}
        </StoreCtx.Provider>
    )
}

export function useStore(){
    return useContext(StoreCtx)
}


