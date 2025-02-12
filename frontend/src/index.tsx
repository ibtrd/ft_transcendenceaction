import Babact from "babact";

function Counter({name, test}) {
	const [state, setState] = Babact.useState(1)
	return <h1>
		Count {name}: {state}
		<button onClick={() => setState(state + 1)}>+</button>
		<button onClick={() => setState(state - 1)}>-</button>
	</h1>
}

function TestCount ({count, setCount}) {
	return <div>
		{count > 5 ? <p>Count is greater than 5</p> : <p>Count is lower than 5</p>}
		<p style={count > 5 ? 'color: red;' : ''}>Count asd: {count}</p>
		<button onClick={() => setCount(count + 1)}>+</button>
		<button onClick={() => setCount(count - 1)}>-</button>
	</div>

}


function Input() {
	const [state, setState] = Babact.useState('')
	const [count, setCount] = Babact.useState(0)
	return <div>
			<input onInput={(e) => setState(e.target.value)}  />
			<p>{state}</p>
			<TestCount count={count} setCount={setCount}/>
		</div>
}

const container = document.getElementById("root")
function View1() {
	const element =  <div>
		<h1>View 1</h1>
		<p>Some text</p>
		<Input />
		<button onClick={View2}>Go to View 2</button>
	</div>
	Babact.render(element, container)
}


function View2() {
	const element = <div>
		<h1>View 2</h1>
		<Counter name='salut' test={<p>Some text</p>}>
			<p>Some text</p>
		</Counter>
		<button onClick={View1}>Go to View 1</button>
	</div>
	Babact.render(element, container)
}

View1()
