<script>
	import { onDestroy, onMount } from "svelte";
	import * as THREE from "three"; // @ts-ignore
	import { cloneDeep } from "lodash";
	import { GROUND_LEVEL, FLOOR_WIDTH, PLAYER_Z } from "../lib/constants";
	import {
		ballMesh,
		createPoseLandmarker,
		loadGLTF,
		invokeCamera,
	} from "../lib/ropes";
	import ThreeScene from "../lib/ThreeScene";
	import CannonWorld from "../lib/CannonWorld";
	import PoseToRotation from "../lib/PoseToRotation";
	import Toss from "../lib/Toss";
	// import Deque from "../lib/Deque";

	// const data_recorder = new Deque();
	// const big_obj = [];

	let threeScene, cannonWorld, video, canvas;
	let player1,
		player1Bones = {};

	let player2,
		player2Bones = {};

	let cameraReady = false,
		mannequinReady = false,
		modelReady = false;

	let poseDetector, poseDetectorAvailable;

	let runAnimation = true,
		showVideo = false,
		animationPointer;

	let handsWaitingThreshold = 1 * 60, // wait 1 second to reload weapon
		speed_threshold = 2;

	let handsEmptyCounterLeft = 0,
		handsWaitingLeft = false,
		handsAvailableLeft = false,
		handBallMeshLeft;
	let handsEmptyCounterRight = 0,
		handsWaitingRight = false,
		handsAvailableRight = false,
		handBallMeshRight;

	let poseToRotation;

	let toss = new Toss();

	const sceneWidth = document.documentElement.clientWidth;
	const sceneHeight = document.documentElement.clientHeight;

	onMount(() => {
		threeScene = new ThreeScene(canvas, sceneWidth, sceneHeight);

		cannonWorld = new CannonWorld(threeScene.scene);

		cannonWorld.addGround();

		if (true) {
			invokeCamera(video, () => {
				cameraReady = true;
			});

			createPoseLandmarker().then((pose) => {
				poseDetector = pose;

				poseDetectorAvailable = true;
			});
		}

		Promise.all([
			loadGLTF("/glb/dors.glb"),
			loadGLTF("/glb/daneel.glb"),
			// loadGLTF(process.env.PUBLIC_URL + "/glb/monster.glb"),
		]).then(([dors, daneel]) => {
			// player1
			player1 = dors.scene.children[0];
			player1.position.set(0, GROUND_LEVEL, PLAYER_Z);

			player1.traverse(function (node) {
				if (node.isMesh) {
					node.castShadow = true;
				}

				if (node.isBone) {
					player1Bones[node.name] = node;
				}
			});

			poseToRotation = new PoseToRotation(player1Bones, "mediapipe");

			threeScene.scene.add(player1);

			// player2
			player2 = daneel.scene.children[0];
			player2.position.set(0, GROUND_LEVEL, -PLAYER_Z);
			player2.rotation.set(0, -Math.PI, 0);

			player2.traverse(function (node) {
				if (node.isMesh) {
					node.castShadow = true;
				}

				if (node.isBone) {
					player2Bones[node.name] = node;
				}
			});

			threeScene.scene.add(player2);

			cannonWorld.daneelBody(player2);

			// all models ready
			cameraReady = true;
			mannequinReady = true;
			modelReady = true;
			// hand is ready for ball mesh
			handsWaitingLeft = true;
			handsAvailableLeft = true;
			handsWaitingRight = true;
			handsAvailableRight = true;
		});
	});

	onDestroy(() => {
		cancelAnimationFrame(animationPointer);
	});

	// when mannequin, model and camera are erady, start animation loop
	$: if (cameraReady && mannequinReady && modelReady) {
		animate();
	}

	function animate() {
		// ========= captured pose logic

		if (
			runAnimation &&
			video &&
			video.readyState >= 2 &&
			poseDetectorAvailable &&
			poseDetector
		) {
			poseDetectorAvailable = false;
			poseDetector.detectForVideo(
				video,
				performance.now(),
				onPoseCallback
			);
		}

		// ========= captured pose logic

		threeScene.onFrameUpdate();

		cannonWorld.onFrameUpdate();

		if (handsWaitingLeft) {
			if (handsEmptyCounterLeft < handsWaitingThreshold) {
				handsEmptyCounterLeft += 1;
			} else {
				handsAvailableLeft = true;
				handsEmptyCounterLeft = 0;
			}
		}

		if (handsWaitingRight) {
			if (handsEmptyCounterRight < handsWaitingThreshold) {
				handsEmptyCounterRight += 1;
			} else {
				handsAvailableRight = true;
				handsEmptyCounterRight = 0;
			}
		}

		if (handsAvailableLeft) {
			// todo add ball to hand

			handBallMeshLeft = ballMesh();

			// console.log("add ball", handBallMeshLeft, player1Bones);

			const tmpvec = new THREE.Vector3();

			player1Bones.LeftHand.getWorldPosition(tmpvec);

			// @ts-ignore
			handBallMeshLeft.position.copy(tmpvec);

			threeScene.scene.add(handBallMeshLeft);

			handsAvailableLeft = false;
			handsWaitingLeft = false;
		}

		if (handsAvailableRight) {
			// todo add ball to hand

			handBallMeshRight = ballMesh();

			const tmpvec = new THREE.Vector3();

			player1Bones.RightHand.getWorldPosition(tmpvec);

			// @ts-ignore
			handBallMeshRight.position.copy(tmpvec);

			threeScene.scene.add(handBallMeshRight);

			handsAvailableRight = false;
			handsWaitingRight = false;
		}

		animationPointer = requestAnimationFrame(animate);
	}

	function onPoseCallback(result) {
		if (result && result.worldLandmarks && result.worldLandmarks[0]) {
			const pose3D = cloneDeep(result.worldLandmarks[0]);

			// data_recorder.addBack({ data: pose3D, t: performance.now() });

			// if (data_recorder.size() > 30) {
			// 	data_recorder.removeFront();
			// }

			// if (data_recorder.size() === 30) {
			// 	big_obj.push(data_recorder.toArray());
			// }

			const width_ratio = 30;
			const height_ratio = (width_ratio * 480) / 640;

			// multiply x,y by differnt factor
			for (let v of pose3D) {
				v["x"] *= width_ratio;
				v["y"] *= -height_ratio;
				v["z"] *= -width_ratio;
			}

			poseToRotation.applyPoseToBone(pose3D, true);

			// move the position of model
			const pose2D = cloneDeep(result.landmarks[0]);

			const to_pos = poseToRotation.applyPosition(pose2D, FLOOR_WIDTH);

			if (to_pos) {
				player1.position.set(to_pos.x, GROUND_LEVEL, PLAYER_Z);
			}

			toss.getHandsPos(player1Bones);

			if (handsWaitingLeft === false && handBallMeshLeft) {
				const velocity = toss.calculateAngularVelocity(
					player1Bones,
					true,
					speed_threshold
				);
				// console.log("velocity", velocity);
				if (velocity) {
					// making ball move

					cannonWorld.project(handBallMeshLeft, velocity);

					handsWaitingLeft = true;
					handBallMeshLeft = null;
				} else {
					// let the ball move with hand

					const tmpvec = new THREE.Vector3();

					player1Bones.LeftHand.getWorldPosition(tmpvec);

					handBallMeshLeft.position.copy(tmpvec);
				}
			}

			if (handsWaitingRight === false && handBallMeshRight) {
				const velocity = toss.calculateAngularVelocity(
					player1Bones,
					false,
					speed_threshold
				);
				// console.log("velocity", velocity);
				if (velocity) {
					// making ball move

					cannonWorld.project(handBallMeshRight, velocity);

					handsWaitingRight = true;
					handBallMeshRight = null;
				} else {
					// let the ball move with hand

					const tmpvec = new THREE.Vector3();

					player1Bones.RightHand.getWorldPosition(tmpvec);

					handBallMeshRight.position.copy(tmpvec);
				}
			}
		}

		poseDetectorAvailable = true;
	}
</script>

<div class="bg">
	<video
		bind:this={video}
		autoPlay={true}
		width={480 / 2}
		height={360 / 2}
		style="position: absolute; top:0; left: 0; display: {showVideo
			? 'block'
			: 'none'}"
	>
		<track label="English" kind="captions" default />
	</video>

	<canvas bind:this={canvas} />

	<div class="controls">
		<div>
			<div class="threshold"><span>Threshold</span></div>
			<label
				>Speed: <input
					bind:value={speed_threshold}
					placeholder=""
				/></label
			>
		</div>
		<div>
			<button
				on:click={() => {
					const mesh = ballMesh();
					// @ts-ignore
					mesh.position.set(0, GROUND_LEVEL + 2, PLAYER_Z);

					threeScene.scene.add(mesh);

					const direction = new THREE.Vector3(0, 0.1, 2).normalize();
					const speed = 36;

					cannonWorld.project(mesh, direction.multiplyScalar(speed));
				}}>throw</button
			>

			{#if runAnimation}
				<button
					on:click={() => {
						runAnimation = !runAnimation;

						// console.log(big_obj);
					}}>stop animation</button
				>
			{:else}
				<button
					on:click={() => {
						runAnimation = !runAnimation;
					}}>run animation</button
				>
			{/if}

			{#if showVideo}
				<button
					on:click={() => {
						showVideo = !showVideo;
					}}>hide video</button
				>
			{:else}
				<button
					on:click={() => {
						showVideo = !showVideo;
					}}>show video</button
				>
			{/if}
		</div>
	</div>
</div>

<style>
	.bg {
		background-color: #0f2027;
	}

	.controls {
		position: absolute;
		bottom: 10px;
		right: 10px;
	}

	.controls .threshold,
	.controls label {
		color: #fff;
	}

	.controls input {
		width: 30px;
		height: 20px;
	}

	.controls button {
		padding: 10px;
		font-size: 20px;
		text-transform: capitalize;
	}
</style>
