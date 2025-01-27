import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cloneDeep } from "lodash";
import { Pose } from "@mediapipe/pose";
// import { createWorkerFactory } from "@shopify/react-web-worker";
import Button from "react-bootstrap/Button";
import "../styles/css/Game.css";

import {
	loadGLTF,
	traverseModel,
	invokeCamera,
	sleep,
} from "../components/ropes";
import PoseToRotation from "../components/PoseToRotation";
import CannonWorld from "../components/CannonWorld";
import ThreeScene from "../components/ThreeScene";
import Toss from "../components/Toss";

// const createWorker = createWorkerFactory(() => import("../pages/HandsWorker"));

function ballMesh() {
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(10),
		new THREE.MeshNormalMaterial()
	);
	mesh.castShadow = true;

	return mesh;
}

export default function Game() {
	const canvasRef = useRef(null);

	const animationPointer = useRef(0);

	const poseDetector = useRef(null);
	const poseDetectorAvailable = useRef(false);
	// apply pose to bones
	const poseToRotation = useRef(null);

	const videoRef = useRef(null);

	// NOTE: we must give a width/height ratio not close to 1, otherwise there will be wired behaviors
	const [subsceneWidth, setsubsceneWidth] = useState(334);
	const [subsceneHeight, setsubsceneHeight] = useState(250);
	const subsceneWidthRef = useRef(0);
	const subsceneHeightRef = useRef(0);
	// the width and height in the 3.js world

	const [loadingCamera, setloadingCamera] = useState(true);
	const [loadingModel, setloadingModel] = useState(true);
	const [loadingSilhouette, setloadingSilhouette] = useState(true);

	// controls
	const [runAnimation, setrunAnimation] = useState(true);
	const runAnimationRef = useRef(true);
	const [showVideo, setshowVideo] = useState(false);

	// player1 model
	const player1 = useRef({});
	// bones of player1 model
	const player1Bones = useRef({});
	// player2 model
	const player2 = useRef({});
	// bones of player2 model
	const player2Bones = useRef({});

	const sceneWidth = document.documentElement.clientWidth;
	const sceneHeight = document.documentElement.clientHeight;

	const groundLevel = -100;

	const threeScene = useRef(null);

	const cannonWorld = useRef(null);

	const toss = new Toss();

	const handsAvailable = useRef(false);
	const handsWaiting = useRef(false);
	const handsEmptyCounter = useRef(0);
	const handBallMesh = useRef(null);

	useEffect(() => {
		setsubsceneWidth(sceneWidth * 0.25);
		setsubsceneHeight((sceneHeight * 0.25 * 480) / 640);

		threeScene.current = new ThreeScene(
			canvasRef.current,
			sceneWidth,
			sceneHeight
		);

		cannonWorld.current = new CannonWorld(
			threeScene.current.scene,
			groundLevel
		);

		// if (false) {
		// 	setloadingCamera(false);
		// 	setloadingModel(false);
		// } else {
		invokeCamera(videoRef.current, () => {
			setloadingCamera(false);
		});

		poseDetector.current = new Pose({
			locateFile: (file) => {
				return process.env.PUBLIC_URL + `/mediapipe/pose/${file}`;
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

		poseDetector.current.onResults(onPoseCallback);

		poseDetector.current.initialize().then(() => {
			setloadingModel(false);

			poseDetectorAvailable.current = true;
		});
		// }

		Promise.all([
			loadGLTF(process.env.PUBLIC_URL + "/glb/daneel.glb"),
			loadGLTF(process.env.PUBLIC_URL + "/glb/dors.glb"),
			// loadGLTF(process.env.PUBLIC_URL + "/glb/monster.glb"),
		]).then(([daneel, dors]) => {
			// player1
			const scale = 100;

			player1.current = dors.scene.children[0];
			player1.current.scale.set(scale, scale, scale);
			player1.current.position.set(0, groundLevel, -sceneWidth / 2);

			traverseModel(player1.current, player1Bones.current);

			poseToRotation.current = new PoseToRotation(player1Bones.current);

			threeScene.current.scene.add(player1.current);

			// player2
			player2.current = daneel.scene.children[0];
			player2.current.scale.set(scale, scale, scale);
			player2.current.position.set(0, groundLevel, sceneWidth / 2);
			player2.current.rotation.set(0, -Math.PI, 0);

			traverseModel(player2.current, player2Bones.current);

			threeScene.current.scene.add(player2.current);

			// all models ready
			setloadingSilhouette(false);
			// hand is ready for ball mesh
			handsWaiting.current = true;
			handsAvailable.current = true;
		});

		return () => {
			cancelAnimationFrame(animationPointer.current);
		};

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (loadingCamera && loadingModel && loadingSilhouette) {
			animate();
		}
		// eslint-disable-next-line
	}, [loadingCamera, loadingModel, loadingSilhouette]);

	useEffect(() => {
		subsceneWidthRef.current = subsceneWidth;
	}, [subsceneWidth]);

	useEffect(() => {
		subsceneHeightRef.current = subsceneHeight;
	}, [subsceneHeight]);

	useEffect(() => {
		runAnimationRef.current = runAnimation;
	}, [runAnimation]);

	function animate() {
		// ========= captured pose logic

		if (
			runAnimationRef.current &&
			videoRef.current &&
			videoRef.current.readyState >= 2 &&
			poseDetectorAvailable.current &&
			poseDetector.current
		) {
			poseDetectorAvailable.current = false;
			poseDetector.current.send({ image: videoRef.current });
		}

		// ========= captured pose logic

		threeScene.current.onFrameUpdate();

		cannonWorld.current.onFrameUpdate();

		if (handsWaiting.current) {
			if (handsEmptyCounter.current < 60) {
				handsEmptyCounter.current += 1;
			} else {
				handsAvailable.current = true;
				handsEmptyCounter.current = 0;
			}
		}

		if (handsAvailable.current) {
			// todo add ball to hand

			handBallMesh.current = ballMesh();

			// console.log("add ball", handBallMesh.current, player1Bones.current);

			const tmpvec = new THREE.Vector3();

			player1Bones.current.RightHand.getWorldPosition(tmpvec);

			handBallMesh.current.position.copy(tmpvec);

			threeScene.current.scene.add(handBallMesh.current);

			handsAvailable.current = false;
			handsWaiting.current = false;
		}

		animationPointer.current = requestAnimationFrame(animate);
	}

	function onPoseCallback(result) {
		if (result && result.poseWorldLandmarks) {
			// console.log(result);
			const pose3D = cloneDeep(result.poseWorldLandmarks);
			// const pose3D = cloneDeep(result.poseLandmarks);

			const width_ratio = 30;
			const height_ratio = (width_ratio * 480) / 640;

			// multiply x,y by differnt factor
			for (let v of pose3D) {
				v["x"] *= width_ratio;
				v["y"] *= -height_ratio;
				v["z"] *= -width_ratio;
			}

			poseToRotation.current.applyPoseToBone(pose3D);

			toss.getHandsPos(player1Bones.current);

			if (handsWaiting.current === false) {
				const velocity = toss.calculateAngularVelocity(false);

				if (velocity) {
					// making ball move
					// console.log("velocity", velocity);

					cannonWorld.current.addBall(handBallMesh.current, velocity);

					handsWaiting.current = true;
					handBallMesh.current = null;
				} else {
					// let the ball move with hand

					const tmpvec = new THREE.Vector3();

					player1Bones.current.RightHand.getWorldPosition(tmpvec);

					handBallMesh.current.position.copy(tmpvec);
				}
			}

			// we need to calculate a direction and velocity

			// move the position of model
			const pose2D = cloneDeep(result.poseLandmarks);

			const to_pos = poseToRotation.current.applyPosition(
				pose2D,
				sceneWidth * 0.6
			);

			if (to_pos) {
				player1.current.position.set(
					to_pos.x,
					groundLevel,
					-sceneWidth / 2
				);
			}
			// let it rest a bit, wait for calculating next model
			// sleep(16);
		}

		poseDetectorAvailable.current = true;
	}

	return (
		<div className="game">
			<video
				ref={videoRef}
				autoPlay={true}
				width={subsceneWidth + "px"}
				height={subsceneHeight + "px"}
				style={{
					display: showVideo ? "block" : "none",
				}}
			></video>

			<canvas ref={canvasRef} />
			{/* // ========= captured pose logic */}
			<div className="btns">
				<Button
					variant="primary"
					onClick={() => {
						setshowVideo(!showVideo);
					}}
				>
					{showVideo ? "hide video" : "show video"}
				</Button>
				<Button
					variant="primary"
					onClick={() => {
						setrunAnimation(!runAnimation);
					}}
				>
					{runAnimation ? "pause animation" : "run animation"}
				</Button>
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
