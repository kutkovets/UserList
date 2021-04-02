import React from 'react';
import 'antd/dist/antd.css';
import {GlobalContext} from "./context/global";
import {env, themeConf} from './settings/config'
import {StateReducer} from "./assets/utils/reducers";
import {L} from "./assets/utils/utils";
import {Layout, Menu, Breadcrumb, PageHeader, Switch} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;


const initState = {
    weiting: false,
};

export default function App() {

    const [global, setGlobal] = React.useState();
    const [state, setState] = React.useReducer(StateReducer, initState);

    const makeGlobal = obj => setGlobal(global ? {...global, ...obj} : {...obj});
    env.__DEV__ && console.log({state, global, env});

    const menuOptions = [
        {title: "Option 1", icon: <PieChartOutlined/>},
        {title: "Option 2", icon: <DesktopOutlined/>},
        {
            title: "User", icon: <UserOutlined/>, options: [
                {title: "Tom"},
                {title: "Bill"},
                {title: "Alex"},
            ]
        },
        {
            title: "Team", icon: <TeamOutlined/>, options: [
                {title: "Team1"},
                {title: "Team2"},
            ]
        },
        {title: "FIles", icon: <FileOutlined/>}
    ];

    global || makeGlobal({
        locale: "ua",
        theme: (L.g("lic", true) || {}).theme || themeConf.theme,
        collapsed: false
    });

    const changeTheme = () => {
        const theme = global.theme === "dark" ? "light" : "dark";
        setGlobal({theme});
        L.add("lic", {theme});
    };

    return <GlobalContext.Provider value={{global, setGlobal: makeGlobal}}>
        {
            global &&
            <Layout style={{minHeight: '100vh'}}>
                <Sider
                    collapsible
                    collapsed={global.collapsed}
                    onCollapse={() => setGlobal({collapsed: !global.collapsed})}
                    theme={global.theme}
                >
                    <div className="logo"/>
                    {
                        !!menuOptions.length &&
                        <Menu defaultSelectedKeys={['1']} mode="inline" theme={global.theme}>
                            {
                                menuOptions.map((option, i) => {
                                    const {options, icon, title} = option;
                                    return options && options.length
                                        ? <SubMenu key={i} icon={icon || null} title={title}>
                                            {
                                                options.map((opt, k) =>
                                                    <Menu.Item key={k} icon={opt.icon}>
                                                        {opt.title}
                                                    </Menu.Item>)
                                            }
                                        </SubMenu>
                                        : <Menu.Item key={i} icon={icon}>{title}</Menu.Item>
                                })
                            }
                        </Menu>
                    }
                </Sider>
                <Layout>
                    <PageHeader
                        className="site-page-header"
                        onBack={() => null}
                        title="Title"
                        subTitle="This is a subtitle"
                        extra={[
                            <Switch
                                key={1}
                                defaultChecked={global.theme === "dark"}
                                checkedChildren="dark"
                                unCheckedChildren="light"
                                onChange={changeTheme}
                            />
                        ]}
                    />
                    <Content style={{margin: '0 16px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                            Bill is a cat.
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>5000</Footer>
                </Layout>
            </Layout>
        }
    </GlobalContext.Provider>
}
