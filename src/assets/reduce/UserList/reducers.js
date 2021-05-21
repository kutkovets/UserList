const userListState = (state, action) => {
    const {type, field, val} = action;
    switch (type) {
        case "weit":
            return {...state, weiting: true};
        case "userList":
            return {...state, weiting: false, userList: val};
        case "reset":
            return {...action.default};
        case "addItem":
        case "editItem":
            if (
                val &&
                val.constructor === {}.constructor &&
                (
                    val.id ||
                    !Object.keys(val).length
                )
            ) return {...state, editItem: val};
            delete state.editItem;
            return {...state};
        case "inputItemVal":
            const {editItem} = state;
            return {...state, editItem: {...editItem, [field]: val}};
        case "deleteItem":
            if (val && val.constructor === {}.constructor && val.id) return {...state, deleteItem: val};
            delete state.deleteItem;
            return {...state};
        default:
            if (field) return {...state, [field]: val !== undefined ? val : null}
    }
};

export const userListReducer = userListState;