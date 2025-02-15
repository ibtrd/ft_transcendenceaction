import Babact from "babact";
import useNavigate from "./useNavigate.js";

export default function Link({to, children, ...props}: {to: string, children?: any}) {

	const navigate = useNavigate();

	const handleClick = (e: any) => {
		e.preventDefault();
		navigate(to);
	};

	return ( 
		<a href={to} onClick={handleClick} {...props}>
			{children}
		</a>
	);

}