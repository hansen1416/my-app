import * as THREE from "three";
import { POSE_LANDMARKS } from "@mediapipe/pose";

import {
	posePointsToVector,
	travelModel,
	bvhToQuaternion,
} from "../components/ropes";

export default class Figure {
	eulerOrder = "XZY";

	parts = {
		Hips: null,
		Spine: null,
		Spine1: null,
		Spine2: null,
		Neck: null,
		Head: null,
		LeftShoulder: null,
		LeftArm: null,
		LeftForeArm: null,
		LeftHand: null,
		LeftHandThumb1: null,
		LeftHandThumb2: null,
		LeftHandThumb3: null,
		LeftHandThumb4: null,
		LeftHandIndex1: null,
		LeftHandIndex2: null,
		LeftHandIndex3: null,
		LeftHandIndex4: null,
		LeftHandMiddle1: null,
		LeftHandMiddle2: null,
		LeftHandMiddle3: null,
		LeftHandMiddle4: null,
		LeftHandRing1: null,
		LeftHandRing2: null,
		LeftHandRing3: null,
		LeftHandRing4: null,
		LeftHandPinky1: null,
		LeftHandPinky2: null,
		LeftHandPinky3: null,
		LeftHandPinky4: null,
		RightShoulder: null,
		RightArm: null,
		RightForeArm: null,
		RightHand: null,
		RightHandThumb1: null,
		RightHandThumb2: null,
		RightHandThumb3: null,
		RightHandThumb4: null,
		RightHandIndex1: null,
		RightHandIndex2: null,
		RightHandIndex3: null,
		RightHandIndex4: null,
		RightHandMiddle1: null,
		RightHandMiddle2: null,
		RightHandMiddle3: null,
		RightHandMiddle4: null,
		RightHandRing1: null,
		RightHandRing2: null,
		RightHandRing3: null,
		RightHandRing4: null,
		RightHandPinky1: null,
		RightHandPinky2: null,
		RightHandPinky3: null,
		RightHandPinky4: null,
		LeftUpLeg: null,
		LeftLeg: null,
		LeftFoot: null,
		RightUpLeg: null,
		RightLeg: null,
		RightFoot: null,
	};

	constructor(obj3d) {
		travelModel(obj3d, this.parts);

		// for (let i in this.parts) {
		// 	console.log(i, this.parts[i].rotation);
		// }

		// this.parts["LeftUpLeg"].rotation.set(0, 0, -3.14);

		// this.parts["LeftFoot"].children[0].rotation.set(1.2, 0, 0);

		// this.parts["LeftFoot"].children[0].children[0].rotation.set(0, 0, 0);

		// this.parts["Head"].children[0].position.set(20, 20, 20);
		// this.parts["Head"].children[1].rotation.set(1.2, 1, 1);
		// this.parts["Head"].children[2].rotation.set(1, 1, 1);

		// console.log(this.parts["Head"]);
		// console.log(this.parts["LeftFoot"]);
	}

	_rotateVectors(v_world, q_parent_world, v_local_origin) {
		const v_local = v_world
			.clone()
			.applyQuaternion(q_parent_world.conjugate());

		const q_local = new THREE.Quaternion().setFromUnitVectors(
			v_local_origin,
			v_local
		);

		// const q_existing = this.parts[bodypart_name].quaternion.clone();
		// // eliminate the existing rotation
		// q_local.multiply(q_existing.conjugate());

		// this.parts[bodypart_name].applyQuaternion(q_local);

		return [
			v_local,
			new THREE.Euler().setFromQuaternion(q_local, this.eulerOrder),
		];
	}

	_checkVisibility(data) {
		if (data[0]) {
			return data[3] < 0.5;
		} else {
			return data.visibility < 0.5;
		}
	}

	makePose(pose_landmark) {
		// compatible with mediapipe pose basis, they are opposite with the basis in threejs
		// if (pose_landmark[0][0]) {

		// 	for (let i in pose_landmark) {
		// 		pose_landmark[i][0] *= -1;
		// 		pose_landmark[i][1] *= -1;
		// 		pose_landmark[i][2] *= -1;
		// 	}
		// } else {
		// 	for (let i in pose_landmark) {
		// 		pose_landmark[i].x *= -1;
		// 		pose_landmark[i].y *= -1;
		// 		pose_landmark[i].z *= -1;
		// 	}
		// }

		this.moveSpine(pose_landmark);

		this.poseArm(pose_landmark, "Left");
		this.poseArm(pose_landmark, "Right");

		this.poseforeArm(pose_landmark, "Left");
		this.poseforeArm(pose_landmark, "Right");

		this.poseThigh(pose_landmark, "Left");
		this.poseThigh(pose_landmark, "Right");

		this.poseCrus(pose_landmark, "Left");
		this.poseCrus(pose_landmark, "Right");

		this.poseFoot(pose_landmark, "Left");
		this.poseFoot(pose_landmark, "Right");
	}

	moveSpine(data) {
		if (!data) {
			return;
		}

		if (
			this._checkVisibility(data[POSE_LANDMARKS["LEFT_HIP"]]) ||
			this._checkVisibility(data[POSE_LANDMARKS["RIGHT_HIP"]]) ||
			this._checkVisibility(data[POSE_LANDMARKS["RIGHT_SHOULDER"]])
		) {
			return;
		}

		const v01 = new THREE.Vector3(-1, 0, 0);
		const v02 = new THREE.Vector3(0.2, 1, 0).normalize();

		const cross01 = new THREE.Vector3().crossVectors(v01, v02).normalize();
		const cross02 = new THREE.Vector3()
			.crossVectors(cross01, v01)
			.normalize();

		const vt1 = posePointsToVector(
			data[POSE_LANDMARKS["LEFT_HIP"]],
			data[POSE_LANDMARKS["RIGHT_HIP"]]
		).normalize();
		const vt2 = posePointsToVector(
			data[POSE_LANDMARKS["RIGHT_SHOULDER"]],
			data[POSE_LANDMARKS["RIGHT_HIP"]]
		).normalize();

		const cross11 = new THREE.Vector3().crossVectors(vt1, vt2).normalize();
		const cross12 = new THREE.Vector3()
			.crossVectors(cross11, vt1)
			.normalize();

		const SE0 = new THREE.Matrix4().makeBasis(v01, cross01, cross02);
		const SE1 = new THREE.Matrix4().makeBasis(vt1, cross11, cross12);

		const q_local = new THREE.Quaternion().setFromRotationMatrix(
			SE1.multiply(SE0.invert())
		);

		// const q_existing = this.parts[bodypart_name].quaternion.clone();
		// // eliminate the existing rotation
		// q_local.multiply(q_existing.conjugate());

		// this.parts[bodypart_name].applyQuaternion(q_local);

		const e_local = new THREE.Euler().setFromQuaternion(
			q_local,
			this.eulerOrder
		);

		this.parts["Hips"].rotation.set(
			e_local.x,
			e_local.y,
			e_local.z,
			this.eulerOrder
		);
	}

	poseArm(data, side = "Right") {
		if (!data) {
			return;
		}

		let data_side = side === "Left" ? "RIGHT_" : "LEFT_";

		if (
			this._checkVisibility(data[POSE_LANDMARKS[data_side + "ELBOW"]]) ||
			this._checkVisibility(data[POSE_LANDMARKS[data_side + "SHOULDER"]])
		) {
			return;
		}

		const v_arm_world = posePointsToVector(
			data[POSE_LANDMARKS[data_side + "ELBOW"]],
			data[POSE_LANDMARKS[data_side + "SHOULDER"]]
		).normalize();

		const q_shoulder_world = new THREE.Quaternion();

		this.parts[side + "Shoulder"].getWorldQuaternion(q_shoulder_world);

		const [v_local, e_arm_local] = this._rotateVectors(
			v_arm_world,
			q_shoulder_world,
			new THREE.Vector3(0, 1, 0)
		);

		// if (side === "Left") {
		//     // console.log(v_arm_local);
		//     e_arm_local.y = Math.PI;
		// } else {
		//     // console.log(v_arm_local);
		//     e_arm_local.y = Math.PI;
		// }

		this.parts[side + "Arm"].rotation.set(
			e_arm_local.x,
			e_arm_local.y,
			e_arm_local.z,
			this.eulerOrder
		);
	}

	poseforeArm(data, side = "Left") {
		if (!data) {
			return;
		}

		let data_side = side === "Left" ? "RIGHT_" : "LEFT_";

		if (
			this._checkVisibility(data[POSE_LANDMARKS[data_side + "WRIST"]]) ||
			this._checkVisibility(data[POSE_LANDMARKS[data_side + "ELBOW"]])
		) {
			return;
		}

		// start forarm
		const v_forearm_world = posePointsToVector(
			data[POSE_LANDMARKS[data_side + "WRIST"]],
			data[POSE_LANDMARKS[data_side + "ELBOW"]]
		).normalize();

		const q_arm_world = new THREE.Quaternion();

		// Arm is the parent of ForeArm
		this.parts[side + "Arm"].getWorldQuaternion(q_arm_world);

		const [v_local, e_forearm_local] = this._rotateVectors(
			v_forearm_world,
			q_arm_world,
			new THREE.Vector3(0, 1, 0)
		);

		// if (side === "Left") {
		// 	// console.log(v_forearm_local);
		// 	e_forearm_local.y = Math.PI;
		// } else {
		// 	// console.log(v_forearm_local);
		// 	e_forearm_local.y = Math.PI;
		// }

		this.parts[side + "ForeArm"].rotation.set(
			e_forearm_local.x,
			e_forearm_local.y,
			e_forearm_local.z,
			this.eulerOrder
		);
	}

	poseHand(data, side = "Right") {
		if (!data) {
			return;
		}

		// let data_side = side === "Left" ? "RIGHT_" : "LEFT_";
	}

	poseThigh(data, side = "Right") {
		if (!data) {
			return;
		}

		let data_side = side === "Left" ? "RIGHT_" : "LEFT_";

		if (
			this._checkVisibility(data[POSE_LANDMARKS[data_side + "KNEE"]]) ||
			this._checkVisibility(data[POSE_LANDMARKS[data_side + "HIP"]])
		) {
			return;
		}

		const v_thigh_world = posePointsToVector(
			data[POSE_LANDMARKS[data_side + "KNEE"]],
			data[POSE_LANDMARKS[data_side + "HIP"]]
		).normalize();

		const q_hips_world = new THREE.Quaternion();

		this.parts["Hips"].getWorldQuaternion(q_hips_world);

		const [v_local, e_thigh_local] = this._rotateVectors(
			v_thigh_world,
			q_hips_world,
			new THREE.Vector3(0, 1, 0)
		);

		// // todo this angle shall follow the angle of foot
		if (side === "Left") {
			// console.log(v_thigh_local);
			e_thigh_local.y = Math.PI;
		} else {
			// console.log(v_thigh_local);
			e_thigh_local.y = Math.PI;
		}

		this.parts[side + "UpLeg"].rotation.set(
			e_thigh_local.x,
			e_thigh_local.y,
			e_thigh_local.z,
			this.eulerOrder
		);
	}

	poseCrus(data, side = "Right") {
		if (!data) {
			return;
		}

		let data_side = side === "Left" ? "RIGHT_" : "LEFT_";

		if (
			this._checkVisibility(data[POSE_LANDMARKS[data_side + "KNEE"]]) ||
			this._checkVisibility(data[POSE_LANDMARKS[data_side + "ANKLE"]])
		) {
			return;
		}

		const v_crus_world = posePointsToVector(
			data[POSE_LANDMARKS[data_side + "ANKLE"]],
			data[POSE_LANDMARKS[data_side + "KNEE"]]
		).normalize();

		const q_thigh_world = new THREE.Quaternion();

		// UpLeg is the parent of Leg
		this.parts[side + "UpLeg"].getWorldQuaternion(q_thigh_world);

		const [v_local, e_crus_local] = this._rotateVectors(
			v_crus_world,
			q_thigh_world,
			new THREE.Vector3(0, 1, 0)
		);

		// // todo this angle shall follow the angle of foot
		if (side === "Left") {
			e_crus_local.y = Math.PI;
		} else {
			e_crus_local.y = Math.PI;
		}

		this.parts[side + "Leg"].rotation.set(
			e_crus_local.x,
			0,
			e_crus_local.z,
			this.eulerOrder
		);
	}

	poseFoot(data, side = "Right") {
		if (!data) {
			return;
		}

		let data_side = side === "Left" ? "RIGHT_" : "LEFT_";

		if (
			this._checkVisibility(
				data[POSE_LANDMARKS[data_side + "FOOT_INDEX"]]
			) ||
			this._checkVisibility(data[POSE_LANDMARKS[data_side + "HEEL"]])
		) {
			return;
		}

		// start foot

		if (true) {
			// vector approach
			const v_foot_world = posePointsToVector(
				data[POSE_LANDMARKS[data_side + "FOOT_INDEX"]],
				data[POSE_LANDMARKS[data_side + "HEEL"]]
			).normalize();

			const q_crus_world = new THREE.Quaternion();

			this.parts[side + "Leg"].getWorldQuaternion(q_crus_world);

			const [v_local, e_foot_local] = this._rotateVectors(
				v_foot_world,
				q_crus_world,
				new THREE.Vector3(0, 1, 0)
			);

			this.parts[side + "Foot"].rotation.set(
				e_foot_local.x,
				// e_foot_local.y,
				0,
				e_foot_local.z,
				this.eulerOrder
			);
		} else {
			// vector basis approach

			// the initial position of a foot,
			// basis1x is heel -> foot_index
			// basis1y is heel -> anckle
			const basis1x = new THREE.Vector3(0, 1, 0);
			const basis1y = new THREE.Vector3(0, 0, 1);
			const basis1z = new THREE.Vector3(1, 0, 0);

			const basis2x = posePointsToVector(
				data[POSE_LANDMARKS[data_side + "FOOT_INDEX"]],
				data[POSE_LANDMARKS[data_side + "HEEL"]]
			).normalize();
			const basis2_vec = posePointsToVector(
				data[POSE_LANDMARKS[data_side + "ANKLE"]],
				data[POSE_LANDMARKS[data_side + "HEEL"]]
			).normalize();
			const basis2z = new THREE.Vector3()
				.crossVectors(basis2x, basis2_vec)
				.normalize();
			const basis2y = new THREE.Vector3()
				.crossVectors(basis2x, basis2z)
				.normalize();

			const SE0 = new THREE.Matrix4().makeBasis(
				basis1x,
				basis1y,
				basis1z
			);
			const SE1 = new THREE.Matrix4().makeBasis(
				basis2x,
				basis2y,
				basis2z
			);

			// // try to eliminate the rotation of crus for foot
			const q_crus_world = new THREE.Quaternion();

			this.parts[side + "Leg"].getWorldQuaternion(q_crus_world);

			const SEp = new THREE.Matrix4().makeRotationFromQuaternion(
				q_crus_world
			);

			// const SEm = SEp.clone().multiply(SE1.clone().invert())

			const q_foot_local = new THREE.Quaternion().setFromRotationMatrix(
				// SE1.multiply(SE0.invert()).multiply(SEp.invert())
				SE1.multiply(SE0.invert())
			);

			const e_foot_local = new THREE.Euler().setFromQuaternion(
				q_foot_local,
				this.eulerOrder
			);

			this.parts[side + "Foot"].rotation.set(
				e_foot_local.x,
				e_foot_local.y,
				e_foot_local.z,
				this.eulerOrder
			);
		}
	}

	makePoseFromRotation(rotations) {
		const q_Hips = bvhToQuaternion(
			rotations["hip.X"][0],
			rotations["hip.Y"][0],
			rotations["hip.Z"][0]
		);

		this.parts["Hips"].applyQuaternion(q_Hips);

		const q_LeftShoulderExisting =
			this.parts["LeftShoulder"].quaternion.clone();

		const e_LeftArmOrigin = new THREE.Euler(0, 0, -Math.PI / 2, "XYZ");

		const q_LeftArmOrigin = new THREE.Quaternion().setFromEuler(
			e_LeftArmOrigin
		);

		const q_LeftArm = bvhToQuaternion(
			rotations["lShldr.X"][0],
			rotations["lShldr.Y"][0],
			rotations["lShldr.Z"][0]
		);

		// q_LeftArm.multiply(q_LeftArmOrigin)

		// q_LeftArm.multiply(q_LeftShoulderExisting.conjugate())

		const e_LeftArm = new THREE.Euler().setFromQuaternion(q_LeftArm);

		console.log(e_LeftArm);
		console.log(
			rotations["lShldr.X"][0],
			rotations["lShldr.Y"][0],
			rotations["lShldr.Z"][0]
		);
		console.log(
			rotations["rShldr.X"][0],
			rotations["rShldr.Y"][0],
			rotations["rShldr.Z"][0]
		);
		/**
6.3282 1.6877 -70.7025
28.6274 43.8972 28.8282
		 */

		// this.parts["LeftArm"].applyQuaternion(q_LeftArmOrigin);
		// this.parts["LeftArm"].rotation.set(rotations["lShldr.X"][0]*-1,rotations["lShldr.Z"][0],rotations["lShldr.Y"][0]*-1);
		this.parts["LeftArm"].rotation.set(
			e_LeftArm.x,
			e_LeftArm.y,
			e_LeftArm.z,
			e_LeftArm.order
		);

		const q_LeftForeArm = bvhToQuaternion(
			rotations["lForeArm.X"][0],
			rotations["lForeArm.Y"][0],
			rotations["lForeArm.Z"][0]
		);

		// this.parts["LeftForeArm"].applyQuaternion(q_LeftForeArm);

		const q_LeftHand = bvhToQuaternion(
			rotations["lHand.X"][0],
			rotations["lHand.Y"][0],
			rotations["lHand.Z"][0]
		);

		// this.parts["LeftHand"].applyQuaternion(q_LeftHand);

		const q_RightArm = bvhToQuaternion(
			rotations["rShldr.X"][0],
			rotations["rShldr.Y"][0],
			rotations["rShldr.Z"][0]
		);

		this.parts["RightArm"].applyQuaternion(q_RightArm);

		const q_RightForeArm = bvhToQuaternion(
			rotations["rForeArm.X"][0],
			rotations["rForeArm.Y"][0],
			rotations["rForeArm.Z"][0]
		);

		this.parts["RightForeArm"].applyQuaternion(q_RightForeArm);

		const q_RightHand = bvhToQuaternion(
			rotations["rHand.X"][0],
			rotations["rHand.Y"][0],
			rotations["rHand.Z"][0]
		);

		this.parts["RightHand"].applyQuaternion(q_RightHand);

		// lower body

		const q_LeftUpLeg = bvhToQuaternion(
			rotations["lThigh.X"][0],
			rotations["lThigh.Y"][0],
			rotations["lThigh.Z"][0]
		);

		this.parts["LeftUpLeg"].applyQuaternion(q_LeftUpLeg);

		const q_LeftLeg = bvhToQuaternion(
			rotations["lShin.X"][0],
			rotations["lShin.Y"][0],
			rotations["lShin.Z"][0]
		);

		this.parts["LeftLeg"].applyQuaternion(q_LeftLeg);

		const q_LeftFoot = bvhToQuaternion(
			rotations["lFoot.X"][0],
			rotations["lFoot.Y"][0],
			rotations["lFoot.Z"][0]
		);

		this.parts["LeftFoot"].applyQuaternion(q_LeftFoot);

		const q_RightUpLeg = bvhToQuaternion(
			rotations["rThigh.X"][0],
			rotations["rThigh.Y"][0],
			rotations["rThigh.Z"][0]
		);

		this.parts["RightUpLeg"].applyQuaternion(q_RightUpLeg);

		const q_RightLeg = bvhToQuaternion(
			rotations["rShin.X"][0],
			rotations["rShin.Y"][0],
			rotations["rShin.Z"][0]
		);

		this.parts["RightLeg"].applyQuaternion(q_RightLeg);

		const q_RightFoot = bvhToQuaternion(
			rotations["rFoot.X"][0],
			rotations["rFoot.Y"][0],
			rotations["rFoot.Z"][0]
		);

		this.parts["RightFoot"].applyQuaternion(q_RightFoot);
	}

	makePoseFromQuaternion(quaternions) {
		for (let name in quaternions) {
			if (quaternions[name]) {
				this.parts[name].setRotationFromQuaternion(quaternions[name]);
			}
		}
	}
}
