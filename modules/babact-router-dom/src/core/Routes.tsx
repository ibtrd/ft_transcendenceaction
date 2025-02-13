import Babact from "babact";
import Route from "./Route.js";

export default function Routes({ children } : { children?: any }) {
	const routes = children.filter(child => child.tag === Route);
	console.log(routes);

	const [ route, setRoute ] = Babact.useState(null);

	Babact.useEffect(() => {
		const handleRoute = () => {
			const currentPath = window.location.pathname;
			console.log(routes.find(route => currentPath.startsWith(route.props.path)))
			setRoute(routes[0]);
		};

		handleRoute();
		window.addEventListener("popstate", handleRoute);

		return () => window.removeEventListener("popstate", handleRoute);
	}, []);

	return route;
}