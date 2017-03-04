import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {

    it('has an initial state', () => {
        const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
        const nextState = reducer(undefined, action);
        expect(nextState).to.equal(fromJS({
            entries: ['Trainspotting']
        }));
    });

    it('can be used with reduce', () => {
        const actions = [
            {type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']},
            {type: 'NEXT'},
            {type: 'SET_CLIENT_ID', id: 'voter1'},
            {type: 'SET_CLIENT_ID', id: 'voter2'},
            {type: 'SET_CLIENT_ID', id: 'voter3'},
            {type: 'VOTE', entry: 'Trainspotting', id: 'voter1'},
            {type: 'VOTE', entry: '28 Days Later', id: 'voter2'},
            {type: 'VOTE', entry: 'Trainspotting', id: 'voter3'},
            {type: 'NEXT'}
        ];
        const finalState = actions.reduce(reducer, Map());

        expect(finalState).to.equal(fromJS({
            winner: 'Trainspotting'
        }));
    });

    it('handles SET_CLIENT_ID', () => {
        const initialState = fromJS({
            vote: {}
        });
        const action = {type: 'SET_CLIENT_ID', id: 'voter1'};
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                clients: {'voter1': ''}
            }
        }));
    });

    it('handles SET_ENTRIES', () =>{
        const initialState = Map();
        const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            entries: ['Trainspotting']
        }));
    });

    it('handles NEXT', () => {
        const initialState = fromJS({
            entries: ['Trainspotting', '28 Days Later']
        });
        const action = {type: 'NEXT'};
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later']
            },
            entries: [],
            round: 1
        }));
    });

    it('handles VOTE', () => {
        const initialState = fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later']
            },
            entries: []
        });
        const action = {type: 'VOTE', entry: 'Trainspotting', id: 'voter1'}
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later'],
                clients: {'voter1': 'Trainspotting'},
                tally: {
                    Trainspotting: 1,
                    '28 Days Later': 0
                }
            },
            entries: []
        }));
    });

});