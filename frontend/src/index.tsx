import Babact from "babact";
import { Router, Route, Routes, Link } from "babact-router-dom";



function View1() {

    return (
        <div>
            <h1>View 1</h1>
            <p>Some text</p>
            <Link to="/view2">View 2</Link>
        </div>
    );
}

function View2() {

    return (
        <div>
            <h1>View 2</h1>
            <p>Some text</p>
            <Link to="/view1">View 1</Link>
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
Babact.render(<App/>, container);

