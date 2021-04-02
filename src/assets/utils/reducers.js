const State = (state, action) => {
    const {type, field, val} = action;
    switch (type) {
        case "weit":
            return {...state, weiting: true};
        case "reset":
            return {...action.default};
        default:
            if (field) return {...state, [field]: val}
    }

};

export const StateReducer = State;