import BabactState from "../core/BabactState";

export default function useState(initial?: any) {
    const oldHook =
		BabactState.wipFiber.alternate &&
		BabactState.wipFiber.alternate.hooks &&
		BabactState.wipFiber.alternate.hooks[BabactState.hookIndex];

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
        BabactState.wipRoot = {
            dom: BabactState.currentRoot.dom,
            props: BabactState.currentRoot.props,
            alternate: BabactState.currentRoot,
            parent: null,
            child: null,
            sibling: null,
			tag: null,
        };
        BabactState.nextUnitOfWork = BabactState.wipRoot;
        BabactState.deletions = [];
    };

    BabactState.wipFiber.hooks.push(hook);
    BabactState.hookIndex++;
    return [hook.state, setState];
}