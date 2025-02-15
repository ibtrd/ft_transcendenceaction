import Babact from "babact";
import Route from "./Route.js";
import RouterContext from "./RouterContext.js";


function findMatchingRoute(routes: any, currentPath: string) {
	return routes.find((route: any) => currentPath.startsWith(route.props.path));
}

export default function Routes({ children } : { children?: any }) {
	const routes = children.filter(child => child.tag === Route);

	const [ route, setRoute ] = Babact.useState(null);
	const { currentPath } = Babact.useContext(RouterContext);

	Babact.useEffect(() => {
		setRoute(findMatchingRoute(routes, currentPath));
	}, [currentPath]);
	return route;
}
