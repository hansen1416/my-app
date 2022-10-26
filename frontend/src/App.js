import { Link, Outlet } from "react-router-dom";
import "./App.css";

function App() {
	return (
		<div className="App">
			<Outlet />
			<nav>
				<ul>
					<li>
						<Link to={`/greenman`}>Green man</Link>
					</li>
					<li>
						<Link to={`/matchman`}>Match man</Link>
					</li>
					<li>
						<Link to={`/upload`}>Upload</Link>
					</li>
					<li>
						<Link to={`/video`}>Video</Link>
					</li>
					<li>
						<Link to={`/camera`}>Camera</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
}

export default App;
