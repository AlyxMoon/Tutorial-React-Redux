import getClientID from './client_id';

export default socket => store => next => action => {
    if(action.meta && action.meta.remote) {
        if(action.type === 'VOTE') action.id = getClientID();
        socket.emit('action', action);
    }
    return next(action);
}