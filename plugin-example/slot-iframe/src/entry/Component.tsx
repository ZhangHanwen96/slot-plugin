import { render } from 'react-dom';
import {useEffect} from "react";
// import { DatePicker, Space, Cascader } from "antd";
// import "antd/dist/antd.css";
import './test.css'

const App: React.FC = () => {
    // return <Space direction="vertical">
    //     <DatePicker  />
    //     <DatePicker picker="week" />
    //     <Cascader status="warning" multiple placeholder="Warning multiple" />
    // </Space>
    useEffect(() => {
        console.log('我是demo')
    }, [])
    return <div className='container'>我是demo rendssder</div>
}

// render(<App/>, document.getElementById('root'))

export default App;