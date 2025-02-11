import { createDom, createElement } from "./vdom.js";

type Props = {
	children?: Array<Fiber>,
	[key: string]: any,
};

type Fiber = {
	tag?: String | Function,
	dom: HTMLElement,
	props?: Props,
	parent: Fiber,
	child: Fiber,
	sibling: Fiber,
	alternate?: Fiber,
	effectTag?: Effect,
	hooks?: Array<any>,
};

enum Effect {
	Deletion = "DELETION",
	Placement = "PLACEMENT",
	Update = "UPDATE",
	None = "NONE",
}

let nextUnitOfWork: Fiber = null;
let wipRoot: Fiber = null;
let currentRoot: Fiber = null;
let deletions: Fiber[] = null;

export function workLoop(deadline: IdleDeadline) {
	//console.log('workLoop', deadline.timeRemaining());
	let shouldYield = false;
	while (nextUnitOfWork && !shouldYield) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
		shouldYield = deadline.timeRemaining() < 1;
	}

	if (!nextUnitOfWork && wipRoot) {
		commitRoot()
	}

	requestIdleCallback(workLoop);
}


function updateHostComponent(fiber: Fiber) {
	if (!fiber.dom) {
		fiber.dom = createDom(fiber);
	}
	reconcileChildren(fiber, fiber.props.children);
}

let wipFiber: Fiber = null;
let hookIndex: number = null;

function updateFunctionComponent(fiber: Fiber) {
	wipFiber = fiber;
	hookIndex = 0;
	wipFiber.hooks = [];
	// @ts-ignore
	const children = [fiber.tag(fiber.props)];
	reconcileChildren(fiber, children);
}

function useState(initial: any) {
	const oldHook =
		wipFiber.alternate &&
		wipFiber.alternate.hooks &&
		wipFiber.alternate.hooks[hookIndex];
	
	const hook = {
		state: oldHook ? oldHook.state : initial,
	}
	wipFiber.hooks.push(hook);

	const setState = (state) => {
		hook.state = state;
		render(currentRoot.props.children[0], currentRoot.dom);
	}

	hookIndex++;
	return [hook.state, setState];
}

function performUnitOfWork(fiber: Fiber): Fiber {
	const isFunctionComponent: Boolean = fiber.tag instanceof Function;
	if (isFunctionComponent) {
		updateFunctionComponent(fiber);
	} else {
		updateHostComponent(fiber);
	}

	if (fiber.child) {
		return fiber.child;
	}
	let nextFiber: Fiber = fiber;
	while (nextFiber) {
		if (nextFiber.sibling) {
			return nextFiber.sibling;
		}
		nextFiber = nextFiber.parent;
	}
	return null;
}

function reconcileChildren(wipFiber: Fiber, elements) {

	let oldFiber: Fiber = wipFiber.alternate && wipFiber.alternate.child;
	let prevSibling: Fiber = null;
	for (let i = 0; i < elements.length || oldFiber != null; i++) {
		const element = elements[i];
		let newFiber: Fiber = null;
		const sameType =
			oldFiber &&
			element &&
			element.tag == oldFiber.tag;

		if (sameType) {
			newFiber = {
				tag: oldFiber.tag,
				props: element.props,
				dom: oldFiber.dom,
				parent: wipFiber,
				child: null,
				sibling: null,
				alternate: oldFiber,
				effectTag: Effect.Update,
			};
		}
		if (element && !sameType) {
			newFiber = {
				tag: element.tag,
				props: element.props,
				dom: null,
				child: null,
				sibling: null,
				parent: wipFiber,
				alternate: null,
				effectTag: Effect.Placement,
			};
		}
		if (oldFiber && !sameType) {
			oldFiber.effectTag = Effect.Deletion;
			deletions.push(oldFiber);
		}

		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}

		if (i === 0) {
			wipFiber.child = newFiber;
		} else if (element) {
			prevSibling.sibling = newFiber;
		}
		prevSibling = newFiber;
	}
}

function commitRoot() {
	deletions.forEach(commitWork);
	commitWork(wipRoot.child)
	currentRoot = wipRoot;
	wipRoot = null;
}

function updateDom(dom: HTMLElement, prevProps: Props, nextProps: Props) {

	// Remove old or changed event listeners
	Object.keys(prevProps)
		.filter(prop => prop.startsWith('on'))
		.filter(prop => !(prop in nextProps) || prevProps[prop] !== nextProps[prop])
		.forEach(name => {
			const eventType = name.toLowerCase().substring(2);
			dom.removeEventListener(eventType, prevProps[name]);
		})

	// Remove old properties
	Object.keys(prevProps)
		.filter(prop => prop !== 'children')
		.filter(prop => !(prop in nextProps))
		.forEach(name => {
			dom[name] = '';
		});

	// Set new or changed properties
	Object.keys(nextProps)
		.filter(prop => prop !== 'children')
		.filter(prop => prevProps[prop] !== nextProps[prop])
		.forEach(name => {
			dom[name] = nextProps[name];
		});

	// Add new event listeners
	Object.keys(nextProps)
		.filter(prop => prop.startsWith('on'))
		.filter(prop => !(prop in prevProps) || prevProps[prop] !== nextProps[prop])
		.forEach(name => {
			const eventType = name.toLowerCase().substring(2);
			dom.addEventListener(eventType, nextProps[name]);
		})
}

function commitDeletion(fiber: Fiber, domParent: HTMLElement) {
	if (fiber.dom) {
		domParent.removeChild(fiber.dom);
	} else {
		commitDeletion(fiber.child, domParent);
	}
}

function commitWork(fiber: Fiber) {
	if (!fiber) {
		return;
	}
	let domParentFiber: Fiber = fiber.parent;
	while (!domParentFiber.dom) {
		domParentFiber = domParentFiber.parent
	}
	const domParent: HTMLElement = domParentFiber.dom;
	if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
		domParent.appendChild(fiber.dom);
	}
	else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
		updateDom(fiber.dom, fiber.alternate.props, fiber.props);
		domParent.appendChild(fiber.dom);
	}
	else if (fiber.effectTag === "DELETION") {
		commitDeletion(fiber, domParent);
		return;
	}
	commitWork(fiber.child);
	commitWork(fiber.sibling);
}

function render(element, container) {
	wipRoot = {
		dom: container,
		props: {
			children: [element],
		},
		alternate: currentRoot,
		parent: null,
		child: null,
		sibling: null,
	};
	deletions = [];
	nextUnitOfWork = wipRoot;
}

const Babact = {
	createElement,
	render,
	useState,
}

requestIdleCallback(workLoop);

export default Babact;
