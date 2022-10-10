import { io } from 'socket.io-client';

export const socket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(process.env.DEVCOLAB_APP_BACKEND_URL, options);
};