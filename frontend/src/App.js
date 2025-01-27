import { Link, Outlet } from "react-router-dom";
import "./App.css";

function App() {
	return (
		<div className="App">
			<Outlet />
			<nav
			// style={{display: 'none'}}
			>
				<ul>
					<li>
						<Link to={`/upload`}>Upload</Link>
					</li>
					<li>
						<Link to={`/video`}>Video</Link>
					</li>
					<li>
						<Link to={`/camera`}>Camera</Link>
					</li>
					<li>
						<Link to={`/holisticcamera`}>Holistic Camera</Link>
					</li>
					<li>
						<Link to={`/greenman`}>Green man</Link>
					</li>
					<li>
						<Link to={`/matchman`}>Match man</Link>
					</li>
					<li>
						<Link to={`/buffergeo`}>Buffer Geo Model</Link>
					</li>
					<li>
						<Link to={`/3dplayground`}>3d Playground</Link>
					</li>
					<li>
						<Link to={`/glbmodelstatic`}>GLBModel Static</Link>
					</li>
					<li>
						<Link to={`/glbmodel`}>GLBModel</Link>
					</li>
					<li>
						<Link to={`/bvhplayer`}>BVH player</Link>
					</li>{" "}
					<li>
						<Link to={`/fbxloader`}>FBX player</Link>
					</li>
					<li>
						<Link to={`/fbxtunning`}>FBX Tunning</Link>
					</li>
					<li>
						<Link to={`/motioncompare`}>Motion Compare</Link>
					</li>
					<li>
						<Link to={`/motioninterpreter`}>
							Motion interpreter
						</Link>
					</li>
					<li>
						<Link to={`/motionsync`}>Motion Sync</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
}

export default App;
