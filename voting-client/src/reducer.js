import {List, Map} from 'immutable';

function setState(state, newState) {
    return state.merge(newState);
}

function vote(state, entry) {
    const currentPair = state.getIn(['vote', 'pair']);
    if(currentPair && currentPair.includes(entry)) {
        return state.merge({
            'hasVoted': entry,
            'hasVotedRound': state.get('round')
        });
    }
    else {
        return state;
    }
}

function resetVote(state) {
    const hasVotedRound = state.get('hasVotedRound');
    const round = state.get('round');
    if(hasVotedRound && hasVotedRound !== round) {
        return state.remove('hasVoted').remove('hasVotedRound');
    }
    else {
        return state;
    }
}

export default function(state = Map(), action) {
    switch(action.type) {
        case 'SET_STATE':
            return resetVote(setState(state, action.state));
        case 'VOTE':
            return vote(state, action.entry);
    }

    return state;
}