/*
 * This holds default state for the preference dialog, and reducers to update max number of schedules to display.
 * Worth noting is it shows the max (meaning user can select 3 but it only displays 2).
 */

// default state
const defaultState = {
    max_schedule_number: Number.parseInt(localStorage.getItem('max_schedule_number') || '3', 10)
}

// reducer
const preferenceReducer = (state = defaultState, action) => {
    let newState = state;

    if (action.type === 'MAX_SCHEDULE_NUM') {
        newState = {
            ...state,
            max_schedule_number: action.number
        }
    }

    // save to local storage
    localStorage.setItem('max_schedule_number', newState.max_schedule_number);

    return newState;
}

export default preferenceReducer;
