import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Button from "react-bootstrap/Button";
// import * as poseDetection from "@tensorflow-models/pose-detection";
import { cloneDeep } from "lodash";
import { Pose } from "@mediapipe/pose";

import SubThreeJsScene from "../components/SubThreeJsScene";
import Silhouette3D from "../components/Silhouette3D";
// import T from "../components/T";
import {
	// BlazePoseKeypoints,
	// BlazePoseConfig,
	drawPoseKeypointsMediaPipe,
	loadJSON,
	// loadFBX,
	invokeCamera,
	// getMeshSize,
	jsonToBufferGeometry,
} from "../components/ropes";

/**
 * To calculate the child's local quaternion, you can use the following steps:

First, compute the inverse of the parent's quaternion. This is necessary because quaternions don't commute, so we need to invert the parent's rotation to move from the world coordinate system to the parent's coordinate system.

Multiply the child's world quaternion by the inverse of the parent's quaternion. This will give you the child's quaternion relative to the parent's coordinate system.

Normalize the resulting quaternion to ensure that it represents a valid rotation.

The math equation for this operation is:

local_quaternion = parent_quaternion.inverse() * child_world_quaternion

Here, parent_quaternion.inverse() refers to the inverse of the parent's quaternion and child_world_quaternion refers to the child's quaternion in world coordinates.

It's important to note that quaternions represent rotations in 3D space, so this calculation assumes that both the child and parent are rotating objects. If one or both of them are static, then their quaternions would be identity quaternions (i.e., [1, 0, 0, 0]), and the local quaternion would be equal to the child's world quaternion.
 * 
 * @returns 
 */
export default function CloudVagabond1() {
	const canvasRef = useRef(null);
	const scene = useRef(null);
	const camera = useRef(null);
	const renderer = useRef(null);
	const controls = useRef(null);

	const animationPointer = useRef(0);

	const figure = useRef([]);
	// const fbxmodel = useRef(null);

	// ========= captured pose logic
	const [capturedPose, setcapturedPose] = useState();
	const counter = useRef(0);
	// ========= captured pose logic

	const poseDetector = useRef(null);

	const videoRef = useRef(null);
	// NOTE: we must give a width/height ratio not close to 1, otherwise there will be wired behaviors
	const [subsceneWidth, setsubsceneWidth] = useState(334);
	const [subsceneHeight, setsubsceneHeight] = useState(250);
	const subsceneWidthRef = useRef(0);
	const subsceneHeightRef = useRef(0);
	// the width and height in the 3.js world
	const visibleWidth = useRef(0);
	const visibleHeight = useRef(0);

	const [loadingCamera, setloadingCamera] = useState(true);
	const [loadingModel, setloadingModel] = useState(true);
	const [loadingSilhouette, setloadingSilhouette] = useState(true);

	useEffect(() => {
		const documentWidth = document.documentElement.clientWidth;
		const documentHeight = document.documentElement.clientHeight;

		setsubsceneWidth(documentWidth * 0.25);
		setsubsceneHeight((documentWidth * 0.25 * 480) / 640);

		subsceneWidthRef.current = documentWidth * 0.25;
		subsceneHeightRef.current = (documentWidth * 0.25 * 480) / 640;

		_scene(documentWidth, documentHeight);

		invokeCamera(videoRef.current, () => {
			setloadingCamera(false);
		});

		poseDetector.current = new Pose({
			locateFile: (file) => {
				return process.env.PUBLIC_URL + `/mediapipe/${file}`;
				// return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
			},
		});
		poseDetector.current.setOptions({
			modelComplexity: 2,
			smoothLandmarks: true,
			enableSegmentation: false,
			smoothSegmentation: false,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
		});

		poseDetector.current.onResults((result) => {
			if (
				!result ||
				!result.poseLandmarks ||
				!result.poseWorldLandmarks
			) {
				return;
			}

			{
				const pose3D = cloneDeep(result.poseWorldLandmarks);

				const width_ratio = 30;
				const height_ratio = (width_ratio * 480) / 640;

				// multiply x,y by differnt factor
				for (let v of pose3D) {
					v["x"] *= -width_ratio;
					v["y"] *= -height_ratio;
					v["z"] *= -width_ratio;
				}

				const g = drawPoseKeypointsMediaPipe(pose3D);

				g.scale.set(8, 8, 8);

				setcapturedPose(g);

				figure.current.applyPose(pose3D);

				// const pose2D = cloneDeep(poses[0]["keypoints"]);

				// figure.current.applyPosition(
				// 	pose2D,
				// 	subsceneWidthRef.current,
				// 	subsceneHeightRef.current,
				// 	visibleWidth.current,
				// 	visibleHeight.current
				// );
			}
		});

		poseDetector.current.initialize().then(() => {
			setloadingModel(false);
			animate();
		});

		// Promise.all([
		// 	poseDetection.createDetector(
		// 		poseDetection.SupportedModels.BlazePose,
		// 		BlazePoseConfig
		// 	),
		// ]).then(([detector]) => {
		// 	poseDetector.current = detector;
		// });

		Promise.all(
			Silhouette3D.limbs.map((name) =>
				loadJSON(process.env.PUBLIC_URL + "/t/" + name + ".json")
			)
		).then((results) => {
			const geos = {};

			for (let data of results) {
				geos[data.name] = jsonToBufferGeometry(data);
			}

			figure.current = new Silhouette3D(geos);
			const body = figure.current.init();

			// getMeshSize(figure.current.foot_l.mesh, scene.current)

			scene.current.add(body);

			setloadingSilhouette(false);
		});

		return () => {
			cancelAnimationFrame(animationPointer.current);
		};

		// eslint-disable-next-line
	}, []);

	function animate() {
		// ========= captured pose logic
		if (
			videoRef.current &&
			videoRef.current.readyState >= 2 &&
			counter.current % 3 === 0 &&
			poseDetector.current
		) {
			poseDetector.current.send({ image: videoRef.current });
		}

		counter.current += 1;
		// ========= captured pose logic

		controls.current.update();

		renderer.current.render(scene.current, camera.current);

		animationPointer.current = requestAnimationFrame(animate);
	}

	function _scene(viewWidth, viewHeight) {
		const backgroundColor = 0x022244;

		scene.current = new THREE.Scene();
		scene.current.background = new THREE.Color(backgroundColor);

		camera.current = new THREE.PerspectiveCamera(
			90,
			viewWidth / viewHeight,
			0.1,
			1000
		);

		camera.current.position.set(0, 0, 150);

		/**
		 * visible_height = 2 * tan(camera_fov / 2) * camera_z
		 * visible_width = visible_height * camera_aspect
		 */

		const vFOV = THREE.MathUtils.degToRad(camera.current.fov); // convert vertical fov to radians

		visibleHeight.current =
			2 * Math.tan(vFOV / 2) * camera.current.position.z; // visible height

		visibleWidth.current = visibleHeight.current * camera.current.aspect; // visible width

		{
			const light = new THREE.PointLight(0xffffff, 1);
			// light.position.set(10, 10, 10);
			camera.current.add(light);

			scene.current.add(camera.current);
		}

		renderer.current = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
		});

		controls.current = new OrbitControls(camera.current, canvasRef.current);

		renderer.current.setSize(viewWidth, viewHeight);
	}

	return (
		<div className="digital-trainer">
			<video
				ref={videoRef}
				autoPlay={true}
				width={subsceneWidth + "px"}
				height={subsceneHeight + "px"}
				style={{
					display: "none",
				}}
			></video>

			<canvas ref={canvasRef} />
			{/* // ========= captured pose logic */}
			<div
				style={{
					width: subsceneWidth + "px",
					height: subsceneHeight + "px",
					position: "absolute",
					top: 0,
					left: 0,
				}}
			>
				<SubThreeJsScene
					width={subsceneWidth}
					height={subsceneHeight}
					objects={capturedPose}
					cameraZ={200}
				/>
			</div>
			{(loadingCamera || loadingModel || loadingSilhouette) && (
				<div className="mask">
					{loadingCamera && (
						<div>
							<span>Preparing Camera....</span>
						</div>
					)}
					{loadingModel && (
						<div>
							<span>Preparing Model....</span>
						</div>
					)}
					{loadingSilhouette && (
						<div>
							<span>Preparing Silhouette...</span>.
						</div>
					)}
				</div>
			)}
		</div>
	);
}
