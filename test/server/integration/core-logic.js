import fs from 'fs'
import crop           from '../../../server/src/image-functions/crop.js'
import {
  newGame,
  addPlayer,
  removePlayer,
  addBodyPart,
  setDimensions,
  addNewDrawing,
  incrementLevel,
  incrementProgress}    from '../../../server/src/core.js'
import  {
  expect,
  assert}         from 'chai'
import {
  drawing1,
  drawing2,
  drawing3,
  drawing4,
  drawing5,
  drawing6}       from '../../helpers/test-drawings.js'

import {INITIAL_STATE} from '../../../server/src/new-game.js'
import deepFreeze     from 'deep-freeze'
import clone          from 'clone'

const [player1, player2, player3] = [1,2,3]
const [head, body, legs] = ['head', 'body', 'legs']
const [body1, body2, body3] = [1,2,3]
const [game1, game2, game3] = [1,2,3]

describe('Core logic Full Game Integration test', () => {

  const gameSetup = [ addPlayer, addPlayer, addPlayer ]

  const setDs = [ setDimensions, setDimensions, setDimensions ]

  const level1 = [ addBodyPart, addBodyPart, addBodyPart ]

  const level2 = [ addBodyPart, addBodyPart, addBodyPart ]

  const level3 = [ addBodyPart, addBodyPart, addBodyPart ]

  const state = gameSetup.reduce( (state, action, i) => action(state, i+1), {})
  const state2 = setDs.reduce( (state, action, i) => action(state, i+1, {height: 500, width: 500 }),state)
  const state3 = level1.reduce( (state, action, i) => action(state, i+1, head, drawing1), state2)
  const state4 = level2.reduce( (state, action, i) => action(state, i+1, body, drawing2), state3)
  const final = level3.reduce( (state, action, i) => action(state, i+1, legs, drawing3), state4)

  for(let i = 1; i < 4; i++) {
    it(`each player has their original drawing back`, () => {
      assert.equal(final.players[i].body, i)
    })

    it('each body has a final drawing dataURL string', () => {
      expect(final.bodies[i].final).to.not.be.empty
    })

    it('each final drawing is a valid dataURL string', () => {
      expect(final.bodies[i].final).to.contain('data:image/png;base64,')
    })
  }

})
