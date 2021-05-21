import React from 'react';
import PropTypes from "prop-types"
import axios from 'axios';
import {Input} from 'antd';
import {IS, Alert} from "../assets/utils/utils";
import {env} from "../settings/config";
import {userListState} from "../assets/reduce/UserList/states"

export default class UserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {valid: !!this.props.user.id};
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        if (
            Object.keys(this.props.user).length &&
            Object.values(this.props.user).length &&
            Object.entries(this.props.user).reduce((acc, cur) => acc += Number(cur[1] && cur[1].length >= 2), 0)
        ) {

            const
                method = this.props.user.id ? "put" : "post",
                url = this.props.user.id
                    ? "user/" + this.props.user.id
                    : "users"
            ;
            axios[method](env.apiUrl + url, this.props.user)
                .then(res => {
                    if (IS.Request(res)) {
                        Alert({status: 200, message: `Your User is ${method}ed`});
                        this.props.setState({type: "reset", default: userListState});
                    }
                    else Alert(res)
                })
                .catch(Alert)
        }
        else Alert({status: 400, message: "not enough data"})
    }

    render() {
        const type = {type: "inputItemVal"};
        return (
            <form
                onSubmit={this.onSubmit}
                style={{width: 300}}
            >
                {
                    ["name", "surname", "desc"]
                        .map(field =>
                            <Input
                                style={{marginBottom: 10}}
                                value={this.props.user[field] || ""}
                                key={field}
                                placeholder={field}
                                name={field}
                                onChange={e => this.props.setState({
                                    ...type,
                                    field,
                                    val: e.target.value.replace(/[^a-zA-Zа-яА-Я0-9їЇіІєЄ\s-.]/g, '')
                                })}
                            />
                        )
                }
                <Input
                    type="submit"
                    value="ok"
                    style={{marginBottom: 10}}
                />
            </form>
        )
    }
}

UserForm.propTypes = {
    user: PropTypes.object,
    setState: PropTypes.func
};