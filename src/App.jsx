import React, {useState} from 'react';
import InpuptShortener from './components/InputShortener';
import BackgroundAnimate from './components/BackgroundAnimation';
import LinkResult from './components/LinkResult';
const App = ()=>{
    const [inputValue, setInputValue] = useState("");
    return (<>
     <div className="container">
        <InpuptShortener setInputValue={setInputValue}/>
        <BackgroundAnimate/>
        <LinkResult inputValue = {inputValue} />
        </div>
    </>)
}

export default App;