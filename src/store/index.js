import { createStore, combineReducers } from 'redux'
import { useContext } from 'react'
import fs from 'fs'
import { SelectedContext } from '../context'

const actionTypes = {
    SET_DATA: 'SET_DATA',
    OPEN_FILE: 'OPEN_FILE',
    UPDATE_SELECTED: 'UPDATE_SELECTED',
    SET_SELECTED: 'SET_SELECTED',
    CLOSE_FILE: 'CLOSE_FILE'
}

// export let selected = []

const initialState = {
    data: null
}

export function useGlobalStore(){
    const {selected} = useContext(SelectedContext)

    const reducer = (state = initialState, action) => {
        let { file, selected, setSelected } = action
        state.data = file;
        let index = selected.findIndex(it => it.id == file.id);
        switch (action.type) {
            case actionTypes.SET_DATA: 
                state.data = file;
                // state.selected = selected;
                // setSelected(selected)
                return state;
            case actionTypes.SET_SELECTED: 
                // setSelected(selected)
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
                        state.data = file;
                    } catch (error) {
                        console.log('读取文件失败')
                    }
                    
                }
                // state.selected = selected;
                // setSelected(selected)
                return state;
            case actionTypes.UPDATE_SELECTED: 
                selected.forEach(it => {
                    if(it.id == file.id){
                        it.current = true;
                    }else{
                        it.current = false;
                    }
                })
                state.data = file;
                // state.selected = selected;
                // setSelected(selected)
                return state;
            case actionTypes.CLOSE_FILE:
                index >= 0 && selected.splice(index, 1)
                selected.forEach(item => {
                    item.current = false;
                });  
                selected[selected.length - 1] && (selected[selected.length - 1].current = true)
                state.data = selected[selected.length - 1];
                // state.selected = selected;
                // setSelected(selected)
                return state;
            default:
                // setSelected([])
                return state;
        }
    }

    return reducer;
    
}

