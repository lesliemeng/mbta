/*
 * This reducer helps update the time in this app.
 */

const timeReducer = (state = new Date(), action) => {

    if (action.type === 'TIME_UPDATE') {
        return new Date();
    }

    return state;
};

export default timeReducer;
