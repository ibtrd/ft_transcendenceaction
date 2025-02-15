import Babact from "babact";
import { Route, Router, Routes } from "babact-router-dom";
import LoginView from "./views/LoginView";
import SigninView from "./views/SigninView";
import Babylon from "./components/Babylon";

export default function App() {
	return <Router>
		<Babylon />
		<div className="w-full h-full absolute top-0 left-0 flex justify-center items-center">
			<Routes>
				<Route path="/login" element={<LoginView />} />
				<Route path="/signin" element={<SigninView />} />
				<Route path="/" element={<LoginView />} />
			</Routes>
		</div>
	</Router>
}