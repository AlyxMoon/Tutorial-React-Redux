import {setEntries, restart, setClientID, next, vote, tallyVotes, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
    switch(action.type) {
    case 'SET_ENTRIES':
        return setEntries(state, action.entries);
    case 'SET_CLIENT_ID':
        return state.update('vote', voteState => setClientID(voteState, action.id));
    case 'RESTART':
        return next(restart(state));
    case 'NEXT':
        return next(state);
    case 'VOTE':
        return state.update('vote', voteState => tallyVotes(vote(voteState, action.id, action.entry)));
    }
    return state;
}