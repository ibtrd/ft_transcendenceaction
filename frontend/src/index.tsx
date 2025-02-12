import Babact from "babact";

function Counter({ name, test }) {
    const [state, setState] = Babact.useState(1);
    return (
        <h1>
            Count {name}: {state}
            <button onClick={() => setState(state + 1)}>+</button>
            <button onClick={() => setState(state - 1)}>-</button>
        </h1>
    );
}

function TestCount({ count, setCount }) {

	let test = 0;
	const handleClick = (e) => {
		test++;
		console.log('test', test);
	}

    Babact.useEffect(() => {
		window.addEventListener('click', handleClick);
		return () => {
			window.removeEventListener('click', handleClick);
		}
    }, []);

    return (
        <div>
            {count > 5 ? <p>Count is greater than 5</p> : <p>Count is lower than 5</p>}
            <p style={count > 5 ? 'color: red;' : ''}>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
            <button onClick={() => setCount(count - 1)}>-</button>
        </div>
    );
}

function Test() {
    Babact.useEffect(() => {
        console.log('useEffect');
        return () => {
            console.log('cleanup useEffect');
        };
    }, []);
    return (
        <div>
            <p>Test</p>
        </div>
    );
}

function EffectTest() {
	return <div>
		<TestCount count={0} setCount={() => {}} />
	</div>
}

function Input() {
    const [state, setState] = Babact.useState('');
    const [count, setCount] = Babact.useState(0);

    return (
        <div>
            <input onInput={(e) => setState(e.target.value)} />
            <p>{state}</p>
            <TestCount count={count} setCount={setCount} />
        </div>
    );
}

const container = document.getElementById("root");
function View1() {
    const element = (
        <div>
            <h1>View 1</h1>
            <button onClick={View2}>Go to View 2</button>
            <p>Some text</p>
            <Input />
            {/* <TestCount count={0} setCount={() => {}} /> */}
            {/* <TestCount count={0} setCount={() => {}} /> */}
			{/* <EffectTest />
			<EffectTest /> */}
        </div>
    );
    Babact.render(element, container);
}

function View2() {
    const element = (
        <div>
            <h1>View 2</h1>
            <button onClick={View1}>Go to View 1</button>
            <Counter name="salut" test={<p>Some text</p>} />
        </div>
    );
    Babact.render(element, container);
}

View1();
