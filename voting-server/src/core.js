import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
    return state.set('entries', List(entries));
}

export function setClientID(voteState, id) {
    return voteState.setIn(
        ['clients', id],
        ''
    );
}

export function next(state) {
    const entries = state.get('entries')
                         .concat(getWinners(state.get('vote')));
    if (entries.size === 1) {
        return state.remove('vote')
                    .remove('entries')
                    .remove('round')
                    .set('winner', entries.first());
    }
    else {
        return state.merge({
            vote: Map({pair: entries.take(2)}),
            entries: entries.skip(2),
            round: state.find((val, key) => { return key === 'round' }, null, 0) + 1
        });
    }
}

export function vote(voteState, id, entry) {
    if(voteState.get('pair').includes(entry)) {
        return voteState.setIn(
            ['clients', id],
            entry
        );
    }
    return voteState;
}

export function tallyVotes(voteState) {
    const [a,b] = voteState.get('pair');
    const clients = voteState.get('clients');

    return voteState.merge({
        'tally': {
            [a]: clients.count(entry => entry === a),
            [b]: clients.count(entry => entry === b)
        }
    });
}

function getWinners(vote) {
    if (!vote) return [];
    const [a,b] = vote.get('pair');
    const aVotes = vote.getIn(['tally', a], 0);
    const bVotes = vote.getIn(['tally', b], 0);
    if      (aVotes > bVotes)   return [a];
    else if (aVotes < bVotes)   return [b];
    else                        return [a,b];
}