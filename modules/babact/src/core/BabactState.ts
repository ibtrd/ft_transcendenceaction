import { IFiber } from "./Fiber";

export interface IBabactState {
	nextUnitOfWork: IFiber | null;
	wipRoot: IFiber | null;
	currentRoot: IFiber | null;
	deletions: IFiber[] | null;
	wipFiber: IFiber | null;
	hookIndex: number;
}

const BabactState = {
	nextUnitOfWork: null,
	wipRoot: null,
	currentRoot: null,
	deletions: null,
	wipFiber: null,
	hookIndex: 0,
} as IBabactState;

export default BabactState;