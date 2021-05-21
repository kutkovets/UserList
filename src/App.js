import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {GlobalContext} from "./context/global";
import {env, themeConf} from './settings/config'
import {userListReducer} from "./assets/reduce/UserList/reducers";
import {userListState} from "./assets/reduce/UserList/states"
import {LS, IS, Alert} from "./assets/utils/utils";
import {Layout, PageHeader, Button, Skeleton} from 'antd';
import {PlusOutlined, SyncOutlined} from '@ant-design/icons';
import UserList from "./components/Table.js"
import UserForm from "./components/EUserForm.js"

const {Content, Footer} = Layout;
const {__DEV__} = env;

export default function App() {

    const [global, setGlobal] = React.useState();
    const [state, setState] = React.useReducer(userListReducer, userListState);

    const makeGlobal = obj => setGlobal(global ? {...global, ...obj} : {...obj});
    __DEV__ && console.log({state, global, env});

    const Fetch = () => axios.get(env.apiUrl + "users")
        .then(res => {
            if (IS.Request({res})) setState({type: "userList", val: res.data});
            else {
                Alert(res);
                setState({type: "userList", val: []});
            }
        })
        .catch(Alert);

    const Remove = () => axios.delete(env.apiUrl + "user/" + state.deleteItem.id)
        .then(res => {
            if (IS.Success({res})) {
                Alert({
                    status: 200,
                    message: `User "${state.deleteItem.name || state.deleteItem.surname || state.deleteItem.desc}" is deleted`
                });
                setState({type: "reset", default: userListState});
            }
            else Alert(res)
        })
        .catch(Alert);


    !!global || makeGlobal({
        locale: "ua",
        theme: (LS.get("lic", true) || {}).theme || themeConf.theme
    });

    React.useEffect(() => {
        if (global && !state.userList) setTimeout(() => Fetch(), 1000);
        if (global && state.deleteItem && state.deleteItem.id) Remove();
    }, [global, state]);

    return <GlobalContext.Provider
        value={{global, setGlobal: makeGlobal}}
    >
        {
            global &&
            <Layout style={{minHeight: '100vh'}}>
                <Layout>
                    <PageHeader
                        className="site-page-header"
                        onBack={() => null}
                        title="UserList"
                        subTitle="This is a subtitle"
                        extra={[
                            <SyncOutlined
                                spin={!state.userList}
                                onClick={() => setState({type: "reset", default: userListState})}
                            />,
                            <Button
                                style={!!state.editItem ? {transform: "rotate(45deg)"} : {}}
                                danger={!!state.editItem}
                                type="primary"
                                shape="circle"
                                icon={<PlusOutlined/>}
                                size="large"
                                onClick={() => setState({type: "addItem", val: !!state.editItem ? undefined : {}})}
                            />
                        ]}
                    />
                    <Content style={{margin: '0 16px'}}>
                        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                            {
                                state.editItem &&
                                <UserForm user={state.editItem} setState={setState}/>
                            }
                            {
                                (
                                    state.userList &&
                                    <UserList
                                        dataSource={state.userList}
                                        pageSize={state.pageSize}
                                        setState={setState}
                                        state={state}
                                    />
                                ) ||
                                <Skeleton active/>
                            }
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>&nbsp;</Footer>
                </Layout>
            </Layout>
        }
    </GlobalContext.Provider>
}
