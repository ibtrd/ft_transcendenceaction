// @ts-ignore
import Babact from "./babact/babact.js"

// function Counter() {
// 	const [state, setState] = Babact.useState(1)
// 	return <h1>
// 		Count: {state}
// 		<button onClick={() => setState(state + 1)}>+</button>
// 		<button onClick={() => setState(state - 1)}>-</button>
// 	</h1>
// }
// const element = Babact.createElement(Counter, {
// 	name: "foo",
// })


function Counter({name, test, children}) {
	const [state, setState] = Babact.useState(1)
	console.log("Counter", test)
	return <h1>
		Count {name}: {state}
		<button onClick={() => setState(state + 1)}>+</button>
		<button onClick={() => setState(state - 1)}>-</button>
		{test}
		{children.map(child => child)}
	</h1>
}


const container = document.getElementById("root")
function View1() {
	const element =  <div>
		<h1>View 1</h1>
		<p>Some text</p>
		<button onClick={View2}>Go to View 2</button>
	</div>
	Babact.render(element, container)
}


function View2() {
	const element = <div>
		<h1>View 2</h1>
		{/* @ts-ignore */}
		<Counter name='salut' test={<p>Some text</p>}>
			<p>Some text</p>
		</Counter>
		<button onClick={View1}>Go to View 1</button>
	</div>
	Babact.render(element, container)
}

View1()
