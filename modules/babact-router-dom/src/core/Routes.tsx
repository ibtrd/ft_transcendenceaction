import Babact from "babact";
import Route from "./Route.js";
import RouterContext from "./RouterContext.js";

export default function Routes({ children } : { children?: any }) {
	const routes = children.filter(child => child.tag === Route);

	const [ route, setRoute ] = Babact.useState(routes[0]);
	const { currentPath } = Babact.useContext(RouterContext);

	Babact.useEffect(() => {
		const newRoute = routes.find((route: any) => currentPath.startsWith(route.props.path));
		if (newRoute) {
			setRoute(newRoute);
		}
	}, [currentPath]);

	return route;
}