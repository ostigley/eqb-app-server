var _ = require('lodash')
const oldObj = {bodies: {1: {head: 'old',body: 'hello',legs: '',clue: '',final: ''},2: {head: '',body: '',legs: '',clue: '',final: ''},3: {head: '',body: '',legs: '',clue: '',final: ''}},level: {current: null,previous: null,hasChanged: false},progress: 0,players: {num: 0, '1': {body: 1}}}
const newObj = {bodies: {1: {head: 'new',body: 'hello',legs: '',clue: '',final: ''},2: {head: '',body: '',legs: '',clue: '',final: ''},3: {head: '',body: '',legs: '',clue: '',final: ''}},level: {current: null,previous: null,hasChanged: false},progress: 0,players: {num: 2, '2': {body: 2}}}


// const diff = _.differenceWith(oldObject, obj2, _.isEqual);

// const diff2 = _.reduce(oldObject, function(result, value, key) {
//     return _.isEqual(value, obj2[key]) ?
//         result : result.concat(key);
// }, []);
const { updatedDiff } = require("deep-object-diff");

 const diff = (oldObject, newObject) => {
    return _.transform(newObject, function(result, value, key, collection) {

      // console.log('\n obj', oldObject)
      if(!oldObject) {
        return result[key]= value
      }
      if (_.isEqual(value, oldObject[key])) return

      if (typeof value === 'object') {
        // console.log('key value', key, '\n', value)
        return result[key]= diff(oldObject[key], value)
      } else {
        return result[key]= value
      }
    }, {})
  }

// const calculateDifference = (oldObject, newObject) => {
//   const result = {}
//   _.each(newObject, function(value, key, collection) {
//     if (_.isEqual(value, oldObject[key])) return

//     if (typeof value === 'object') {
//       return result[key]= calculateDifference(oldObject[key], value)
//     } else {
//       return result[key]= value
//     }
//   }, )

//   return result
// }


console.log(diff(oldObj, newObj))
// console.log(newObj)