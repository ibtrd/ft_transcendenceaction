import BabactState from "./BabactState";
import { IFiber } from "./Fiber";
import { ElementProps } from "./Element";

export function render(element: IFiber, container: HTMLElement) {
	BabactState.wipRoot = {
		dom: container,
		props: {
			children: [element],
		},
		alternate: BabactState.currentRoot,
		parent: null,
		child: null,
		sibling: null,
		tag: null,
	};
	BabactState.deletions = [];
	BabactState.nextUnitOfWork = BabactState.wipRoot;
}

