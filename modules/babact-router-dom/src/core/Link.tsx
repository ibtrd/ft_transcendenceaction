import Babact from "babact";
import RouterContext from "./RouterContext.js";

export default function Link({to, children}: {to: string, children?: any}) {

	const { setCurrentPath } = Babact.useContext(RouterContext);

	const handleClick = (e: any) => {
		e.preventDefault();
		window.history.pushState(null, "", to);
		setCurrentPath(to);
	};

	return ( 
		<a href={to} onClick={handleClick}>
			{children}
		</a>
	);

}