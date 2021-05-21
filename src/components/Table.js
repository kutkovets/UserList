import React from 'react';
import PropTypes from "prop-types";
import {Table, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';

const EditButtons = prop => {
    const {edited, row, editItem, deleteItem} = prop;
    return <>
        <Tooltip title={`${edited ? "cancel " : ""}edit ${row.name || "this item"}`}>
            <EditOutlined
                onClick={() => editItem(edited ? null : row)}
                style={{width: 32, color: edited ? "red" : "inherit"}}
            />
        </Tooltip>
        {
            !edited &&
            <Tooltip title={`delete ${row.name || "this item"}`}>
                <DeleteOutlined onClick={() => deleteItem(row)} style={{width: 32}}/>
            </Tooltip>
        }
    </>
};

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setSelRow = this.setSelRow.bind(this);
        this.editItem = this.editItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    setSelRow(value) {
        this.setState({selRow: value});
    }

    editItem(row) {
        this.props.setState({type: "editItem", val: row})
    }

    deleteItem(row) {
        this.props.setState({type: "deleteItem", val: row})
    }

    render() {
        return (
            <Table
                columns={["name", "surname", "desc"]
                    .map(it => {
                        return {title: it, dataIndex: it}
                    })
                    .concat({
                        title: '',
                        dataIndex: '',
                        key: 'x',
                        width: "100px",
                        render: (_, row, index) => {
                            const prop = {
                                row,
                                hover : index === this.state.selRow,
                                edited : row.id === ((this.props.state.editItem || {}).id || null),
                                editItem : this.editItem,
                                deleteItem : this.deleteItem
                            };
                            return prop.hover || prop.edited
                                ? <EditButtons {...prop}/>
                                : null
                        }
                    })
                }
                dataSource={this.props.dataSource
                    .map((it, i) => {
                        return {...it, key: i}
                    })}
                pagination={{
                    pageSize: this.props.pageSize,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onMouseEnter: () => this.setSelRow(rowIndex),
                        onMouseLeave: () => this.setSelRow(),
                    };
                }}
            />
        )
    }
}

UserList.propTypes = {
    setState: PropTypes.func,
    dataSource: PropTypes.array,
    pageSize: PropTypes.number,
    state: PropTypes.object,
};