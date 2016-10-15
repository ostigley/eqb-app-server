import {createStore} 		from 'redux'
import reducer					from './reducer.js'

export const makeStore = () => createStore(reducer)