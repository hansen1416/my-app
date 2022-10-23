import * as THREE from "three";
import { degreesToRadians, originToEnd } from "./ropes";

export class Figure {
	constructor(scene, params) {
		this.params = {
			x: 0,
			y: 0,
			z: 0,
			ry: 0,
			...params,
		};

		this.headHue = 279;
		this.bodyHue = 132;

		this.bodyMaterial = new THREE.MeshBasicMaterial({
			color: 0x44aa88,
		});
		this.purpleMaterial = new THREE.MeshBasicMaterial({
			color: 0x33eeb0,
		});

		this.group = new THREE.Group();

		this.group.position.x = this.params.x;
		this.group.position.y = this.params.y;
		this.group.position.z = this.params.z;
		this.group.position.ry = this.params.ry;

		this.group.rotation.x = 0;
		this.group.rotation.y = 0;

		scene.add(this.group);

		this.unit = 0.1;

		this.head_radius = 4 * this.unit;
		this.eye_radius = 1 * this.unit;
		this.neck_radius = 1.6 * this.unit;
		this.neck_size = 2 * this.unit;

		this.shoulder_size = 6 * this.unit;
		this.spine_size = 12 * this.unit;
		this.waist_size = 5 * this.unit;

		this.shoulder_radius = 1.8 * this.unit;

		this.left_shoulder_pos = new THREE.Vector3();
		this.right_shoulder_pos = new THREE.Vector3();

		this.deltoid_radius = 1.8 * this.unit;
		this.bigarm_size = 8 * this.unit;
		this.elbow_radius = 1.6 * this.unit;

		this.left_elbow_pos = new THREE.Vector3();
		this.right_elbow_pos = new THREE.Vector3();

		this.smallarm_size = 8 * this.unit;
		this.wrist_size = 1.2 * this.unit;

		this.hip_radius = 2.8 * this.unit;

		this.left_hip_pos = new THREE.Vector3();
		this.right_hip_pos = new THREE.Vector3();

		this.thigh_radius = 2.8 * this.unit;
		this.thigh_size = 10 * this.unit;
		this.knee_radius = 2.4 * this.unit;

		this.left_knee_pos = new THREE.Vector3();
		this.right_knee_pos = new THREE.Vector3();

		this.crus_size = 10 * this.unit;
		this.ankle_radius = 1.8 * this.unit;
	}

	createBody() {
		const radiusTop = this.shoulder_size; // ui: radiusTop
		const height = this.spine_size; // ui: height
		const radiusBottom = this.waist_size; // ui: radiusBottom

		const radialSegments = 8; // ui: radialSegments, how smooth is the curve

		const geometry = new THREE.CylinderGeometry(
			radiusTop,
			radiusBottom,
			height,
			radialSegments
		);

		this.body = new THREE.Mesh(geometry, this.bodyMaterial);

		this.body.position.y = this.spine_size / 2;

		this.group.add(this.body);
	}

	createHead() {
		// Create a new group for the head
		this.head = new THREE.Group();

		const neck_geo = new THREE.CylinderGeometry(
			this.neck_radius,
			this.neck_radius,
			this.neck_size
		);
		const neck_mesh = new THREE.Mesh(neck_geo, this.purpleMaterial);

		neck_mesh.position.y = this.spine_size + this.neck_size / 2;

		this.group.add(neck_mesh);

		const head_geo = new THREE.SphereGeometry(this.head_radius);

		// Create the main cube of the head and add to the group
		// const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
		const headMesh = new THREE.Mesh(head_geo, this.bodyMaterial);
		this.head.add(headMesh);

		// Position the head group
		this.head.position.y =
			this.spine_size + this.head_radius + this.neck_size;

		// Add the head group to the figure
		this.group.add(this.head);

		// Add the eyes by calling the function we already made
		const eyes = new THREE.Group();
		const eye_geo = new THREE.CircleGeometry(this.eye_radius, 8);

		// Define the eye material
		const material = new THREE.MeshLambertMaterial({ color: 0x44445c });

		for (let i = 0; i < 2; i++) {
			const eye = new THREE.Mesh(eye_geo, material);
			const sign = i % 2 === 0 ? -1 : 1;

			// Add the eye to the group
			eyes.add(eye);

			// Position the eye
			eye.position.x = (sign * this.head_radius) / 3;
		}

		// Move the eyes forwards by half of the head depth -
		// it might be a good idea to create a variable to do this!
		eyes.position.y = 0;
		eyes.position.z = this.head_radius;

		// in createEyes()
		this.head.add(eyes);
	}

	createArms() {
		// Set the variable

		const shoulder_geo = new THREE.SphereGeometry(this.shoulder_radius);

		const bigarm_geo = new THREE.CylinderGeometry(
			this.deltoid_radius,
			this.elbow_radius,
			this.bigarm_size
		);

		const elbow_geo = new THREE.SphereGeometry(this.elbow_radius);

		for (let i = 0; i < 2; i++) {
			const sign = i % 2 === 0 ? -1 : 1;

			const bigarm_group = new THREE.Group();

			const shoulder = new THREE.Mesh(shoulder_geo, this.purpleMaterial);
			const bigarm = new THREE.Mesh(bigarm_geo, this.bodyMaterial);
			const elbow = new THREE.Mesh(elbow_geo, this.purpleMaterial);

			shoulder.position.y = 0;

			// Translate the arm (not the group) downwards by half the height
			// so the group rotates at the shoulder
			bigarm.position.y = this.bigarm_size * -0.5;

			elbow.position.y = this.bigarm_size * -1;

			bigarm_group.add(shoulder);

			bigarm_group.add(bigarm);

			bigarm_group.add(elbow);

			this.group.add(bigarm_group);

			bigarm_group.position.x =
				sign * (this.shoulder_size / 2 + this.deltoid_radius * 2);

			bigarm_group.position.y = this.spine_size - this.shoulder_radius;

			if (i % 2 === 0) {
				bigarm_group.rotation.z = degreesToRadians(-40);

				elbow.getWorldPosition(this.left_elbow_pos);
			} else {
				bigarm_group.rotation.z = degreesToRadians(30);

				elbow.getWorldPosition(this.right_elbow_pos);
			}

			// // Helper
			// const box = new THREE.BoxHelper(bigarm_group, 0xffff00);
			// this.group.add(box);
		}

		const smallarm_geo = new THREE.CylinderGeometry(
			this.elbow_radius,
			this.wrist_size,
			this.smallarm_size
		);

		for (let i = 0; i < 2; i++) {
			const smallarm_group = new THREE.Group();
			const smallarm = new THREE.Mesh(smallarm_geo, this.bodyMaterial);

			// Translate the arm (not the group) downwards by half the height
			smallarm.position.y = this.smallarm_size * -0.5;

			smallarm_group.add(smallarm);

			this.group.add(smallarm_group);

			if (i % 2 === 0) {
				smallarm_group.position.x = this.left_elbow_pos.x;
				smallarm_group.position.y = this.left_elbow_pos.y;
				smallarm_group.position.z = this.left_elbow_pos.z;

				smallarm_group.rotation.x = degreesToRadians(-20);
				smallarm_group.rotation.y = degreesToRadians(20);
				smallarm_group.rotation.z = degreesToRadians(10);
			} else {
				smallarm_group.position.x = this.right_elbow_pos.x;
				smallarm_group.position.y = this.right_elbow_pos.y;
				smallarm_group.position.z = this.right_elbow_pos.z;

				smallarm_group.rotation.x = degreesToRadians(-30);
				smallarm_group.rotation.y = degreesToRadians(-30);
				smallarm_group.rotation.z = degreesToRadians(-30);
			}
		}
	}

	createLegs() {
		const hip_geo = new THREE.SphereGeometry(this.hip_radius);

		const thigh_geo = new THREE.CylinderGeometry(
			this.thigh_radius,
			this.knee_radius,
			this.thigh_size
		);

		const knee_geo = new THREE.SphereGeometry(this.knee_radius);

		for (let i = 0; i < 2; i++) {
			const sign = i % 2 === 0 ? -1 : 1;

			const thigh_group = new THREE.Group();

			const hip = new THREE.Mesh(hip_geo, this.purpleMaterial);
			const thigh = new THREE.Mesh(thigh_geo, this.bodyMaterial);
			const knee = new THREE.Mesh(knee_geo, this.purpleMaterial);

			hip.position.y = 0;

			// Translate the arm (not the group) downwards by half the height
			// so the group rotates at the shoulder
			thigh.position.y = this.thigh_size * -0.5;

			knee.position.y = this.thigh_size * -1;

			thigh_group.add(hip);

			thigh_group.add(thigh);

			thigh_group.add(knee);

			this.group.add(thigh_group);

			thigh_group.position.x = sign * this.thigh_radius;

			thigh_group.position.y = (-1 / 3) * this.hip_radius;

			if (i % 2 === 0) {
				thigh_group.rotation.x = degreesToRadians(-20);

				knee.getWorldPosition(this.left_knee_pos);
			} else {
				// thigh_group.rotation.z = degreesToRadians(0);

				knee.getWorldPosition(this.right_knee_pos);
			}
		}

		const crus_geo = new THREE.CylinderGeometry(
			this.knee_radius,
			this.ankle_radius,
			this.crus_size
		);

		for (let i = 0; i < 2; i++) {
			const crus_group = new THREE.Group();
			const crus = new THREE.Mesh(crus_geo, this.bodyMaterial);

			// Translate the arm (not the group) downwards by half the height
			crus.position.y = this.crus_size * -0.5;

			crus_group.add(crus);

			this.group.add(crus_group);

			if (i % 2 === 0) {
				crus_group.position.x = this.left_knee_pos.x;
				crus_group.position.y = this.left_knee_pos.y;
				crus_group.position.z = this.left_knee_pos.z;
			} else {
				crus_group.position.x = this.right_knee_pos.x;
				crus_group.position.y = this.right_knee_pos.y;
				crus_group.position.z = this.right_knee_pos.z;

				crus_group.rotation.x = degreesToRadians(10);
			}
		}
	}

	init() {
		this.createBody();
		this.createHead();
		this.createArms();
		this.createLegs();
	}
}
