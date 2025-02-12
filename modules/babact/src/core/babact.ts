import { createElement } from "./vdom.js";
import { createDom } from "./dom.js";

export type Props = {
	children?: Array<Fiber>,
	[key: string]: any,
};

export interface Fiber {
	tag?: String | Function,
	dom: HTMLElement | Text,
	props: Props,
	parent: Fiber | null,
	child: Fiber | null,
	sibling: Fiber | null,
	alternate: Fiber | null,
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
	let shouldYield = false;
	while (nextUnitOfWork && !shouldYield) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
		shouldYield = deadline.timeRemaining() < 1;
	}

	if (!nextUnitOfWork && wipRoot) {
		commitRoot()
	}

	window.requestIdleCallback(workLoop);
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
        queue: [] as any[],
    };

    const actions = oldHook ? oldHook.queue : [];
    actions.forEach(action => {
        hook.state = typeof action === 'function' ? action(hook.state) : action;
    });

    const setState = (action: any) => {
        hook.queue.push(action);
        wipRoot = {
            dom: currentRoot.dom,
            props: currentRoot.props,
            alternate: currentRoot,
            parent: null,
            child: null,
            sibling: null,
        };
        nextUnitOfWork = wipRoot;
        deletions = [];
    };

    wipFiber.hooks.push(hook);
    hookIndex++;
    return [hook.state, setState];
}

export function useEffect(callback: () => void | (() => void), deps: any[]) {
    const oldHook =
        wipFiber.alternate &&
        wipFiber.alternate.hooks &&
        wipFiber.alternate.hooks[hookIndex];

    const hook = {
        deps,
        cleanup: null as (() => void) | null,
    };

    if (!oldHook) {
        const cleanup = callback();
        if (typeof cleanup === 'function') {
            hook.cleanup = cleanup;
        }
    } else {
        const hasChanged = !oldHook.deps || oldHook.deps.some((dep, i) => dep !== deps[i]);
        if (hasChanged) {
            if (oldHook.cleanup) {
                oldHook.cleanup();
            }
            const cleanup = callback();
            if (typeof cleanup === 'function') {
                hook.cleanup = cleanup;
            }
        } else {
            hook.cleanup = oldHook.cleanup;
        }
    }

    wipFiber.hooks.push(hook);
    hookIndex++;
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
        });

    // Remove old properties
    Object.keys(prevProps)
        .filter(prop => prop !== 'children')
        .filter(prop => !(prop in nextProps))
        .forEach(name => {
            (dom as any)[name] = '';
        });

    // Set new or changed properties
    Object.keys(nextProps)
        .filter(prop => prop !== 'children')
        .filter(prop => prevProps[prop] !== nextProps[prop])
        .forEach(name => {
            (dom as any)[name] = nextProps[name];
        });

    // Add new event listeners
    Object.keys(nextProps)
        .filter(prop => prop.startsWith('on'))
        .filter(prop => !(prop in prevProps) || prevProps[prop] !== nextProps[prop])
        .forEach(name => {
            const eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, nextProps[name]);
        });
}

function removeEffect(fiber: Fiber) {
	if (!fiber) {
		return;
	}
	if (fiber.hooks) {
		fiber.hooks.forEach(hook => {
			if (hook.cleanup) {
				hook.cleanup();
				hook.cleanup = null;
			}
		});
	}
	removeEffect(fiber.child);
	removeEffect(fiber.sibling);
}

function commitDeletion(fiber: Fiber, domParent: HTMLElement | Text) {
	removeEffect(fiber);
    if (fiber.dom) {
        domParent.removeChild(fiber.dom);
    } else {
		commitDeletion(fiber.child, domParent);
	}
}


function commitWork(fiber: Fiber | null) {
    if (!fiber) {
        return;
    }
    let domParentFiber: Fiber = fiber.parent;
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent;
    }
    const domParent: HTMLElement | Text = domParentFiber.dom;
    if (fiber.effectTag === Effect.Placement && fiber.dom != null) {
        domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === Effect.Update && fiber.dom != null) {
        updateDom(fiber.dom as HTMLElement, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === Effect.Deletion) {
        commitDeletion(fiber, domParent);
        return;
    }
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function render(element: Fiber, container: HTMLElement) {
	wipRoot = {
		dom: container,
		props: {
			children: [element],
		},
		alternate: currentRoot,
		parent: null,
		child: null,
		sibling: null,
		effectTag: Effect.Update,
	};
	deletions = [];
	nextUnitOfWork = wipRoot;
}

const Babact = {
	createElement,
	render,
	useState,
	useEffect,
}

window.requestIdleCallback(workLoop);

export default Babact;
