import { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";

import { loadFBX, loadObj, traverseModel, traverseModelNoChild } from "./ropes";

export default function MotionMaker(props) {
	const { scene, camera, renderer, controls } = props;

	const figure = useRef(null);

	const bodyParts = useRef({});
	const bodyPartsNoChild = useRef({});

	const BicycleCrunchTracks = useRef(null);
	const BicycleCrunchIndex = useRef(0);

	useEffect(() => {
		const modelpath =
			// process.env.PUBLIC_URL + "/fbx/XBot.fbx";
			process.env.PUBLIC_URL + "/fbx/YBot.fbx";

		Promise.all([
			loadFBX(modelpath),
			loadObj(process.env.PUBLIC_URL + "/json/BicycleCrunch.json"),
		]).then(([model, jsonObj]) => {
			figure.current = model;

			figure.current.position.set(0, -100, 0);

			traverseModel(figure.current, bodyParts.current);
			traverseModelNoChild(figure.current, bodyPartsNoChild.current);

			// console.log(figure.current)

			scene.current.add(figure.current);

			// calculate quaternions and vectors for animation tracks
			for (let item of jsonObj["tracks"]) {

				if (item["type"] === "quaternion") {
					const quaternions = [];
					for (let i = 0; i < item["values"].length; i += 4) {
						const q = new Quaternion(
							item["values"][i],
							item["values"][i + 1],
							item["values"][i + 2],
							item["values"][i + 3]
						);

						quaternions.push(q);
					}

					item["quaternions"] = quaternions;
				}

				if (item["type"] === "vector") {
					const vectors = [];
					for (let i = 0; i < item["values"].length; i += 3) {
						const q = new Vector3(
							item["values"][i],
							item["values"][i + 1],
							item["values"][i + 2]
						);

						vectors.push(q);
					}

					item["vectors"] = vectors;
				}
			}
			// BicycleCrunchTracks.current = jsonObj["tracks"].slice(0,24);
			BicycleCrunchTracks.current = jsonObj["tracks"];

			// console.log(BicycleCrunchTracks.current)

			animate();
		});
		// eslint-disable-next-line
	}, []);

	function animate() {
		requestAnimationFrame(animate);

		// trackball controls needs to be updated in the animation loop before it will work
		controls.current.update();

		// if (BicycleCrunchIndex.current >= 0) {
		// 	BicycleCrunchIndex.current += 1;

		// 	if (
		// 		BicycleCrunchIndex.current >=
		// 		BicycleCrunchTracks.current[0]["values"].length
		// 	) {
		// 		BicycleCrunchIndex.current = -1;
		// 	}
		// }

		renderer.current.render(scene.current, camera.current);
	}

	function playAnimation() {

		applyTransfer();

		BicycleCrunchIndex.current += 1;
	}

	function applyTransfer() {
		for (let item of BicycleCrunchTracks.current) {
			const item_name = item["name"].split(".")[0];

			// console.log(item_name, bodyParts.current[item_name]);

			if (item["type"] === "vector") {

				if (BicycleCrunchIndex.current < item["vectors"].length) {

					bodyParts.current[item_name].position.set(
						item["vectors"][BicycleCrunchIndex.current].x,
						item["vectors"][BicycleCrunchIndex.current].y,
						item["vectors"][BicycleCrunchIndex.current].z
					);
				} else {
					bodyParts.current[item_name].position.set(
						item["vectors"][item["vectors"].length - 1].x,
						item["vectors"][item["vectors"].length - 1].y,
						item["vectors"][item["vectors"].length - 1].z
					);
				}

				// bodyPartsNoChild.current[item_name].position.set(
				// 	item["vectors"][BicycleCrunchIndex.current].x,
				// 	item["vectors"][BicycleCrunchIndex.current].y,
				// 	item["vectors"][BicycleCrunchIndex.current].z
				// );
			}

			if (item["type"] === "quaternion") {

				if (BicycleCrunchIndex.current < item["quaternions"].length) {

					bodyParts.current[item_name].setRotationFromQuaternion(
					// bodyParts.current[item_name].applyQuaternion(
						item["quaternions"][BicycleCrunchIndex.current]
					);
				} else {
					bodyParts.current[item_name].setRotationFromQuaternion(
						// bodyParts.current[item_name].applyQuaternion(
							item["quaternions"][item["quaternions"].length-1]
						);
				}

				// bodyPartsNoChild.current[item_name].applyQuaternion(
				// 	item["quaternions"][0]
				// );
			}
		}
	}

	return (
		<div>
			<div className="btn-box">
				<button
					onClick={() => {
						playAnimation();
					}}
				>
					action1
				</button>
				<button onClick={() => {}}>action2</button>
				<button onClick={() => {}}>BicycleCrunch</button>
			</div>
		</div>
	);
}
