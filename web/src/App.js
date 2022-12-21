import { Link, Outlet } from "react-router-dom";
import "./App.css";

function App() {
	return (
		<div className="App">
			<Outlet />
			<nav>
				<ul>
					<li>
						<Link to={`/motionsync`}>Motion Sync</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
}

export default App;
