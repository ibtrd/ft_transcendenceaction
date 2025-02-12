import BabactState from "../core/BabactState";

export default function useEffect(callback: () => void | (() => void), deps: any[]) {
    const oldHook =
		BabactState.wipFiber.alternate &&
		BabactState.wipFiber.alternate.hooks &&
		BabactState.wipFiber.alternate.hooks[BabactState.hookIndex];

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

    BabactState.wipFiber.hooks.push(hook);
    BabactState.hookIndex++;
}