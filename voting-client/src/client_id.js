import uuid from 'uuid';

export default function getClientID() {
    let id = localStorage.getItem('id');
    if(!id) {
        id = uuid.v4();
        localStorage.setItem('id', id);
    }
    return id;
}