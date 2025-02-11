import Babact from "../node_modules/Babact/dist/index.js";

function Counter({name, test}) {
	const [state, setState] = Babact.useState(1)
	return <h1>
		Count {name}: {state}
		<button onClick={() => setState(state + 1)}>+</button>
		<button onClick={() => setState(state - 1)}>-</button>
	</h1>
}


function Input() {
	const [state, setState] = Babact.useState('')
	return <div>
			<input onInput={(e) => setState(e.target.value)}  />
			<p>{state}</p>
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
