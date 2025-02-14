import Babact from "babact";

const ThemeContext = Babact.createContext();
const RouterContext = Babact.createContext();

function View1() {

    const { theme } = Babact.useContext(ThemeContext);

    return (
        <div style={`background-color: ${theme === 'light' ? 'white' : 'black'}; color: ${theme === 'light' ? 'black' : 'white'}`}>
            <h1>View 1</h1>
            <p>Some text</p>
            <Input />
            <ClickColor />
        </div>
    );
}

function View2() {

    const { path } = Babact.useContext(RouterContext);

    return (
        <div>
            <h1>View 2</h1>
            <p>Some text</p>
            <ThemeButton />
            <p>Path: {path}</p>
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


function ThemeButton() {
    const {theme, setTheme} = Babact.useContext(ThemeContext);

    return <button onClick={theme === 'light' ? () => setTheme('dark') : () =>setTheme('light')}>{theme}</button>;
}

function Input() {
    const {path, setPath} = Babact.useContext(RouterContext);
    return <div>
        <input onInput={(e) => setPath(e.target.value)}  value={path}/>
        <p>{path}</p>
    </div>
}


function App()  {

    const [theme, setTheme] = Babact.useState('light');
    const [path, setPath] = Babact.useState('/');

    return <div>
        <h1>App</h1>
        {/* @ts-ignore */}
        <ThemeContext.Provider value={{
            theme,
            setTheme
        }}>
            {/* @ts-ignore */}
            <RouterContext.Provider value={{
                path,
                setPath
            }}>
                {/* @ts-ignore */}
                <Test>
                    <View1 />
                    <View2 />
                </Test>
            </RouterContext.Provider>
        </ThemeContext.Provider>
    </div>
}


const container = document.getElementById("root");
Babact.render(<App/>, container);

