
import { IFiber, EffectTag, FiberProps } from './Fiber'
import BabactState from './BabactState'
import { IElement } from './Element';

export function reconcileChildren(wipFiber: IFiber, elements: IElement[]) {

	let oldFiber: IFiber = wipFiber.alternate && wipFiber.alternate.child;
	let prevSibling: IFiber = null;
	for (let i = 0; i < elements.length || oldFiber != null; i++) {
		const element = elements[i];
		let newFiber: IFiber = null;
		console.log('old', oldFiber, wipFiber.alternate);
		const sameType =
			oldFiber &&
			element &&
			element.tag == oldFiber.tag;

		if (sameType) {
			newFiber = {
				tag: oldFiber.tag,
				props: element.props as FiberProps,
				dom: oldFiber.dom,
				parent: wipFiber,
				child: null,
				sibling: null,
				alternate: oldFiber,
				effectTag: EffectTag.Update,
				context: oldFiber.context,
			};
		}
		if (element && !sameType) {
			newFiber = {
				tag: element.tag,
				props: element.props as FiberProps,
				dom: null,
				child: null,
				sibling: null,
				parent: wipFiber,
				alternate: null,
				effectTag: EffectTag.Placement,
			};
			console.log('new', newFiber);
			console.log('element', element);
			console.log('sameType', sameType);
		}
		if (oldFiber && !sameType) {
			console.log('delete', oldFiber);
			oldFiber.effectTag = EffectTag.Deletion;
			BabactState.deletions.push(oldFiber);
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
