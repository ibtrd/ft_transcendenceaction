import Babact from "babact";
import RouterContext from "./RouterContext.js";

export default function Router({ children } : { children?: any }) {
	let [params, setParams] = Babact.useState({});

	return (
		<RouterContext.Provider value={{params, setParams}}>
			{children}
		</RouterContext.Provider>
	);
}