import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {setEntries, restart, setClientID, next, vote, tallyVotes} from '../src/core';

describe('application logic', () => {

    describe('setEntries', () =>{

        it('adds the entries to the state', () => {
            const state = Map();
            const entries = List.of('Trainspotting', '28 Days Later');
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Trainspotting', '28 Days Later'),
                startEntries: List.of('Trainspotting', '28 Days Later')
            }));
        });

        it('converts to immutable', () => {
            const state = Map();
            const entries = ['Trainspotting', '28 Days Later'];
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Trainspotting', '28 Days Later'),
                startEntries: List.of('Trainspotting', '28 Days Later')
            }));
        });

    });

    describe('restart', () => {

        it('wipes the state and makes entries equal to the start entries', () => {
            const state = fromJS({
                entries: ['Trainspotting', '28 Days Later'],
                startEntries: ['Trainspotting', '28 Days Later', 'Sunshine', 'The Beach'],
                round: 2,
                vote: {
                    pair: ['127 Hours', 'Trance'],
                    tally: {
                        '127 Hours': 1,
                        'Trance': 1
                    },
                    clients: {
                        'voter1': 'Trance',
                        'voter2': '127 Hours'
                    }
                }
            });
            const nextState = restart(state);
            expect(nextState).to.equal(fromJS({
                entries: ['Trainspotting', '28 Days Later', 'Sunshine', 'The Beach'],
                startEntries: ['Trainspotting', '28 Days Later', 'Sunshine', 'The Beach']
            }));
        });

    });

    describe('setClientID', () => {

        it('adds a client to the list', () => {
            const state = Map();
            const nextState = setClientID(state, 'voter1');
            expect(nextState).to.equal(Map({
                clients: Map({
                    voter1: ''
                })
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

        it('changes the vote of the client', () => {
            const state = fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                clients: {
                    'voter1': '',
                    'voter2': ''
                }
            });
            const nextState = vote(state, 'voter1', 'Trainspotting');
            expect(nextState).to.equal(fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                clients: {
                    'voter1': 'Trainspotting',
                    'voter2': ''
                }
            }));
        });

        it('adds client to list if not already in it', () => {
            const state = fromJS({
                pair: ['Trainspotting', '28 Days Later']
            });
            const nextState = vote(state, 'voter1', 'Trainspotting');
            expect(nextState).to.equal(fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                clients: {
                    'voter1': 'Trainspotting'
                }
            }));
        });

        it('does not allow voting for entry not in current pair', () => {
            const state = fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                clients: {
                    'voter1': 'Trainspotting',
                    'voter2': ''
                }
            });
            const nextState = vote(state, 'voter1', 'Sunshine');
            expect(nextState).to.equal(fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                clients: {
                    'voter1': 'Trainspotting',
                    'voter2': ''
                }
            }));
        });

    });

    describe('tallyVotes', () => {

        it('tally entries based on client votes', () => {
            const state = fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                clients: {
                    'voter1': 'Trainspotting',
                    'voter2': 'Trainspotting'
                }
            });
            const nextState = tallyVotes(state);
            expect(nextState).to.equal(fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                clients: {
                    'voter1': 'Trainspotting',
                    'voter2': 'Trainspotting'
                },
                tally: {
                    'Trainspotting': 2,
                    '28 Days Later': 0
                }
            }));
        });

        it('do not tally entries for votes not in current pair', () => {
            const state = fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                clients: {
                    'voter1': 'Trainspotting',
                    'voter2': 'Sunshine',
                    'voter3': '28 Days Later'
                }
            });
            const nextState = tallyVotes(state);
            expect(nextState).to.equal(fromJS({
                pair: ['Trainspotting', '28 Days Later'],
                clients: {
                    'voter1': 'Trainspotting',
                    'voter2': 'Sunshine',
                    'voter3': '28 Days Later'
                },
                tally: {
                    'Trainspotting': 1,
                    '28 Days Later': 1
                }
            }));
        });

    });

});