import React, { createContext, useContext, useReducer } from 'react'
import fs from 'fs'

const actionTypes = {
    SET_CUR_DIR: 'SET_CUR_DIR',
    SET_CUR_CHILDREN: 'SET_CUR_CHILDREN',
    INIT_DATA: 'INIT_DATA',
    EDIT_FILE: 'EDIT_FILE',
    UPDATE_SELECTED: 'UPDATE_SELECTED',
    SET_SELECTED: 'SET_SELECTED',
    CLOSE_FILE: 'CLOSE_FILE',
    SET_ISCHANGE: 'SET_ISCHANGE',
    NEW_FILE: 'NEW_FILE',
    SAVE_FILE: 'SAVE_FILE',
    TORENAME: 'TORENAME',
    RENAME: 'RENAME',
    DEL_FILE: 'DEL_FILE'
}

export const initialState = {
    currentDir: null,
    data: null,
    selected: []
}

export function reducer(state = initialState, action){
    const { type, payload, renderService } = action
    switch (type) {
        case actionTypes.SET_CUR_DIR:
            const { file } = payload
            return Object.assign({}, state, {
                currentDir: file
            })
        case actionTypes.SET_CUR_CHILDREN:
            return Object.assign({}, state)
        case actionTypes.INIT_DATA: 
            return Object.assign({}, state)
        case actionTypes.SET_SELECTED: 
            return Object.assign({}, state)
        case actionTypes.EDIT_FILE: 
            {
                const { file, selected } = renderService.editFile(payload)
                return Object.assign({}, state, {
                    data: file,
                    selected
                })
            }
        case actionTypes.UPDATE_SELECTED: 
            {
                const { file, selected } = renderService.updateSelected(payload)
                return Object.assign({}, state, {
                    data: file,
                    selected
                })
            }
        case actionTypes.CLOSE_FILE:
            {
                const { file, selected } = renderService.closeFile(payload)
                return Object.assign({}, state, {
                    data: file,
                    selected
                })
            }
        case actionTypes.SET_ISCHANGE: 
            {
                const { file, selected } = renderService.setIsChange(payload)
                return Object.assign({}, state, {
                    data: file,
                    selected
                })
            }
        case actionTypes.NEW_FILE:
            {
                const { file, selected } = renderService.newFile(payload)
                return Object.assign({}, state, {
                    data: file,
                    selected
                })
            }
        case actionTypes.SAVE_FILE:
            {
                const { file, selected } = renderService.saveFile(payload)
                return Object.assign({}, state, {
                    data: file,
                    selected
                })
            }
        case actionTypes.TORENAME:
            return Object.assign({}, state, payload)
        case actionTypes.RENAME:
            {
                const { file, selected } = renderService.rename(payload)
                return Object.assign({}, state, {
                    data: file,
                    selected
                })
            }
        case actionTypes.DEL_FILE:
            {
                const { file, selected } = renderService.delFile(payload)
                return Object.assign({}, state, {
                    data: file,
                    selected
                })
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


