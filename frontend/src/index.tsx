import Babact from "babact";

const ThemeContext = Babact.createContext('light');

function View1() {
    return (
        <div>
            <h1>View 1</h1>
            <p>Some text</p>
            <Input />
            <ClickColor />
        </div>
    );
}

function View2() {

    const theme = Babact.useContext(ThemeContext);
    return (
        <div>
            <h1>View 2</h1>
            <p>Some text</p>
            <p>{theme}</p>
        </div>
    );
}


function ClickColor() {
    const [color, setColor] = Babact.useState('black');

    Babact.useEffect(() => {
        console.log('Color changed to ' + color);
    }, [color]);

    return <div>
        <button onClick={() => setColor('red')}>Red</button>
        <button onClick={() => setColor('blue')}>Blue</button>
        <button onClick={() => setColor('green')}>Green</button>
        <p style={`color: ${color}`}>Color</p>
    </div>
}

function Test({ children }) {
    return <>
        <h1>Test</h1>
        {children}
    </>;
}


function Input() {
    const [state, setState] = Babact.useState('');
    return <div>
        <input onInput={(e) => setState(e.target.value)}  value={state}/>
        <p>{state}</p>
    </div>
}

const container = document.getElementById("root");
function App() {
    const element = (
        <div>
            <h1>App</h1>
            {/* @ts-ignore */}
            <ThemeContext.Provider>
                {/* @ts-ignore */}
                <Test>
                    <View1 />
                    <View2 />
                </Test>
            </ThemeContext.Provider>
        </div>
    );
    Babact.render(element, container);
}

App();
