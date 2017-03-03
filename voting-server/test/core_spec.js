import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

    describe('setEntries', () =>{

        it('adds the entries to the state', () => {
            const state = Map();
            const entries = List.of('Trainspotting', '28 Days Later');
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Trainspotting', '28 Days Later')
            }));
        });

        it('converts to immutable', () => {
            const state = Map();
            const entries = ['Trainspotting', '28 Days Later'];
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Trainspotting', '28 Days Later')
            }));
        });

    });

    describe('next', () => {

        it('takes the next two entries under vote', () => {
            const state = Map({
                entries: List.of('Trainspotting', '28 Days Later', 'Sunshine'),
                round: 1
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later')
                }),
                entries: List.of('Sunshine'),
                round: 2
            }));
        });

        it('creates round counter with value of 1 if it does not exist', () => {
            const state = Map({
                entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later')
                }),
                entries: List.of('Sunshine'),
                round: 1
            }));
        });

        it('puts winner of current vote back to entries', () => {
            const state = fromJS({
                vote: {
                    pair: ['Trainspotting', '28 Days Later'],
                    tally: {
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    }
                },
                entries: ['Sunshine', 'Millions', '127 Hours'],
                round: 2
            });
            const nextState = next(state);
            expect(nextState).to.equal(fromJS({
                vote: {
                    pair: ['Sunshine', 'Millions']
                },
                entries: ['127 Hours', 'Trainspotting'],
                round: 3
            }));
        });

        it('puts both from tied vote back to entries', () => {
            const state = fromJS({
                vote: {
                    pair: ['Trainspotting', '28 Days Later'],
                    tally: {
                        'Trainspotting': 3,
                        '28 Days Later': 3
                    }
                },
                entries: ['Sunshine', 'Millions', '127 Hours'],
                round: 2
            });
            const nextState = next(state);
            expect(nextState).to.equal(fromJS({
                vote: {
                    pair: ['Sunshine', 'Millions']
                },
                entries: ['127 Hours', 'Trainspotting', '28 Days Later'],
                round: 3
            }));
        });

        it('marks winner when just one entry left', () => {
            const state = fromJS({
                vote: {
                    pair: ['Trainspotting', '28 Days Later'],
                    tally: {
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    }
                },
                entries: [],
                round: 2
            });
            const nextState = next(state);
            expect(nextState).to.equal(fromJS({
                winner: 'Trainspotting'
            }));
        });

    });

    describe('vote', () => {

        it('creates a tally for the voted entry', () => {
            const state = fromJS({
                pair: ['Trainspotting', '28 Days Later']
            });
            const nextState = vote(state, 'Trainspotting');
            expect(nextState).to.equal(fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                tally: {'Trainspotting': 1}
            }));
        });

        it('adds to existing tally for the voted entry', () => {
            const state = fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                tally: {
                    'Trainspotting': 3,
                    '28 Days Later': 2
                }
            });
            const nextState = vote(state, 'Trainspotting');
            expect(nextState).to.equal(fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                tally: {
                    'Trainspotting': 4,
                    '28 Days Later': 2
                }
            }));
        });

        it('does not allow voting for entry not in current pair', () => {
            const state = fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                tally: {
                    'Trainspotting': 4,
                    '28 Days Later': 2
                }
            });
            const nextState = vote(state, 'Sunshine');

            expect(nextState).to.equal(fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                tally: {
                    'Trainspotting': 4,
                    '28 Days Later': 2
                }
            }));
        });

    });

});