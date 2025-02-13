import Babact from "babact";
import { Router, Route, Routes } from "babact-router-dom";
import useEffect from "babact/dist/hooks/useEffect";

function View1() {

    const [count, setCount] = Babact.useState(0);
  
    useEffect(() => {
        console.log(count);
        if (count > 5)
            setCount(0);
    }, [count]);

    return (
        <div>
            <h1>View 1</h1>
            <p>Some text</p>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

function View2() {

    return (
        <div>
            <h1>View 2</h1>
            <p>Some text</p>
        </div>
    );
}



function App()  {

    return <Router>
        <Routes>
            <Route path="/view1" element={<View1 />} />
            <Route path="/view2" element={<View2 />} />
        </Routes>
    </Router>
}


const container = document.getElementById("root");
Babact.render(<View1/>, container);

