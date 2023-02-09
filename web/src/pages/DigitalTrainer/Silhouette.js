import { useEffect, useState } from "react";

export default function Silhouette({ width, height, colors }) {

	const defaultColor = "rgba(100,100,100,0.5)"

	const [chestColor, setchestColor] = useState(defaultColor);
	const [leftUpperArmColor, setleftUpperArmColor] = useState(defaultColor);
	const [leftForeArmColor, setleftForeArmColor] = useState(defaultColor);
	const [rightUpperArmColor, setrightUpperArmColor] = useState(defaultColor);
	const [rightForeArmColor, setrightForeArmColor] = useState(defaultColor);
	const [abdominalColor, setabdominalColor] = useState(defaultColor);
	const [leftThighColor, setleftThighColor] = useState(defaultColor);
	const [leftCalfColor, setleftCalfColor] = useState(defaultColor);
	const [rightThighColor, setrightThighColor] = useState(defaultColor);
	const [rightCalfColor, setrightCalfColor] = useState(defaultColor);

	useEffect(() => {

		if (colors['chest']) {
			setchestColor(colors['chest'])
		}

		if (colors['leftupperarm']) {
			setleftUpperArmColor(colors['leftupperarm'])
		}

		if (colors['leftforearm']) {
			setleftForeArmColor(colors['leftforearm'])
		}

		if (colors['rightupperarm']) {
			setrightUpperArmColor(colors['rightupperarm'])
		}

		if (colors['rightforearm']) {
			setrightForeArmColor(colors['rightforearm'])
		}

		if (colors['abdominal']) {
			setabdominalColor(colors['abdominal'])
		}

		if (colors['leftthigh']) {
			setleftThighColor(colors['leftthigh'])
		}

		if (colors['leftcalf']) {
			setleftCalfColor(colors['leftcalf'])
		}

		if (colors['rightthigh']) {
			setrightThighColor(colors['rightthigh'])
		}

		if (colors['rightcalf']) {
			setrightCalfColor(colors['rightcalf'])
		}

	}, [colors])

	return (
		<svg
			version="1.1"
			id="Capa_1"
			xmlns="http://www.w3.org/2000/svg"
			// xmlns:xlink="http://www.w3.org/1999/xlink"
			width={width + "px"}
			height={height + "px"}
			viewBox="0 0 206.326 206.326"
			// xml:space="preserve"
		>
			<g>
				<g>
					<path
						fill="none"
						stroke="none"
						d="M104.265,117.959c-0.304,3.58,2.126,22.529,3.38,29.959c0.597,3.52,2.234,9.255,1.645,12.3
			c-0.841,4.244-1.084,9.736-0.621,12.934c0.292,1.942,1.211,10.899-0.104,14.175c-0.688,1.718-1.949,10.522-1.949,10.522
			c-3.285,8.294-1.431,7.886-1.431,7.886c1.017,1.248,2.759,0.098,2.759,0.098c1.327,0.846,2.246-0.201,2.246-0.201
			c1.139,0.943,2.467-0.116,2.467-0.116c1.431,0.743,2.758-0.627,2.758-0.627c0.822,0.414,1.023-0.109,1.023-0.109
			c2.466-0.158-1.376-8.05-1.376-8.05c-0.92-7.088,0.913-11.033,0.913-11.033c6.004-17.805,6.309-22.53,3.909-29.24
			c-0.676-1.937-0.847-2.704-0.536-3.545c0.719-1.941,0.195-9.748,1.072-12.848c1.692-5.979,3.361-21.142,4.231-28.217
			c1.169-9.53-4.141-22.308-4.141-22.308c-1.163-5.2,0.542-23.727,0.542-23.727c2.381,3.705,2.29,10.245,2.29,10.245
			c-0.378,6.859,5.541,17.342,5.541,17.342c2.844,4.332,3.921,8.442,3.921,8.747c0,1.248-0.273,4.269-0.273,4.269l0.109,2.631
			c0.049,0.67,0.426,2.977,0.365,4.092c-0.444,6.862,0.646,5.571,0.646,5.571c0.92,0,1.931-5.522,1.931-5.522
			c0,1.424-0.348,5.687,0.42,7.295c0.919,1.918,1.595-0.329,1.607-0.78c0.243-8.737,0.768-6.448,0.768-6.448
			c0.511,7.088,1.139,8.689,2.265,8.135c0.853-0.407,0.073-8.506,0.073-8.506c1.461,4.811,2.569,5.577,2.569,5.577
			c2.411,1.693,0.92-2.983,0.585-3.909c-1.784-4.92-1.839-6.625-1.839-6.625c2.229,4.421,3.909,4.257,3.909,4.257
			c2.174-0.694-1.9-6.954-4.287-9.953c-1.218-1.528-2.789-3.574-3.245-4.789c-0.743-2.058-1.304-8.674-1.304-8.674
			c-0.225-7.807-2.155-11.198-2.155-11.198c-3.3-5.282-3.921-15.135-3.921-15.135l-0.146-16.635
			c-1.157-11.347-9.518-11.429-9.518-11.429c-8.451-1.258-9.627-3.988-9.627-3.988c-1.79-2.576-0.767-7.514-0.767-7.514
			c1.485-1.208,2.058-4.415,2.058-4.415c2.466-1.891,2.345-4.658,1.206-4.628c-0.914,0.024-0.707-0.733-0.707-0.733
			C115.068,0.636,104.01,0,104.01,0h-1.688c0,0-11.063,0.636-9.523,13.089c0,0,0.207,0.758-0.715,0.733
			c-1.136-0.03-1.242,2.737,1.215,4.628c0,0,0.572,3.206,2.058,4.415c0,0,1.023,4.938-0.767,7.514c0,0-1.172,2.73-9.627,3.988
			c0,0-8.375,0.082-9.514,11.429l-0.158,16.635c0,0-0.609,9.853-3.922,15.135c0,0-1.921,3.392-2.143,11.198
			c0,0-0.563,6.616-1.303,8.674c-0.451,1.209-2.021,3.255-3.249,4.789c-2.408,2.993-6.455,9.24-4.29,9.953
			c0,0,1.689,0.164,3.909-4.257c0,0-0.046,1.693-1.827,6.625c-0.35,0.914-1.839,5.59,0.573,3.909c0,0,1.117-0.767,2.569-5.577
			c0,0-0.779,8.099,0.088,8.506c1.133,0.555,1.751-1.047,2.262-8.135c0,0,0.524-2.289,0.767,6.448
			c0.012,0.451,0.673,2.698,1.596,0.78c0.779-1.608,0.429-5.864,0.429-7.295c0,0,0.999,5.522,1.933,5.522
			c0,0,1.099,1.291,0.648-5.571c-0.073-1.121,0.32-3.422,0.369-4.092l0.106-2.631c0,0-0.274-3.014-0.274-4.269
			c0-0.311,1.078-4.415,3.921-8.747c0,0,5.913-10.488,5.532-17.342c0,0-0.082-6.54,2.299-10.245c0,0,1.69,18.526,0.545,23.727
			c0,0-5.319,12.778-4.146,22.308c0.864,7.094,2.53,22.237,4.226,28.217c0.886,3.094,0.362,10.899,1.072,12.848
			c0.32,0.847,0.152,1.627-0.536,3.545c-2.387,6.71-2.083,11.436,3.921,29.24c0,0,1.848,3.945,0.914,11.033
			c0,0-3.836,7.892-1.379,8.05c0,0,0.192,0.523,1.023,0.109c0,0,1.327,1.37,2.761,0.627c0,0,1.328,1.06,2.463,0.116
			c0,0,0.91,1.047,2.237,0.201c0,0,1.742,1.175,2.777-0.098c0,0,1.839,0.408-1.435-7.886c0,0-1.254-8.793-1.945-10.522
			c-1.318-3.275-0.387-12.251-0.106-14.175c0.453-3.216,0.21-8.695-0.618-12.934c-0.606-3.038,1.035-8.774,1.641-12.3
			c1.245-7.423,3.685-26.373,3.38-29.959l1.008,0.354C103.809,118.312,104.265,117.959,104.265,117.959z"
					/>
				</g>
				<path
					id="leftthigh"
					fill={leftThighColor}
					stroke="none"
					d="M104.265,117.959c-0.304,3.58,2.126,22.529,3.38,29.959c0.597,3.52,2.234,9.255,1.645,12.3L109.6,157L119.3,154
					c-0.676-1.937-0.847-2.704-0.536-3.545c0.719-1.941,0.195-9.748,1.072-12.848c1.692-5.979,3.361-21.142,4.231-28.217z"
				/>
				<path
					id="leftcalf"
					fill={leftCalfColor}
					stroke="none"
					d="M109.6,157L109.6,160c-0.841,4.244-1.084,9.736-0.621,12.934c0.292,1.942,1.211,10.899-0.104,14.175c-0.688,1.718-1.949,10.522-1.949,10.522
			c-3.285,8.294-1.431,7.886-1.431,7.886c1.017,1.248,2.759,0.098,2.759,0.098c1.327,0.846,2.246-0.201,2.246-0.201
			c1.139,0.943,2.467-0.116,2.467-0.116c1.431,0.743,2.758-0.627,2.758-0.627c0.822,0.414,1.023-0.109,1.023-0.109
			c2.466-0.158-1.376-8.05-1.376-8.05c-0.92-7.088,0.913-11.033,0.913-11.033c6.004-17.805,6.309-22.53,3.909-29.24L119.4,153z"
				/>
				<path
					id="leftupperarm"
					fill={leftUpperArmColor}
					stroke="none"
					d="M121,66c2.381,3.705,2.29,10.245,2.29,10.245L135,77.6
					c-3.3-5.282-3.921-15.135-3.921-15.135l-0.146-16.635
					c-1.157-11.347-9.518-11.429-9.518-11.429z"

				/>
				<path
					id="leftforearm"
					fill={leftForeArmColor}
					stroke="none"
					d="M123.4,74L123.4,77c-0.378,6.859,5.541,17.342,5.541,17.342c2.844,4.332,3.921,8.442,3.921,8.747
					c0,1.248-0.273,4.269-0.273,4.269l0.109,2.631
			c0.049,0.67,0.426,2.977,0.365,4.092c-0.444,6.862,0.646,5.571,0.646,5.571c0.92,0,1.931-5.522,1.931-5.522
			c0,1.424-0.348,5.687,0.42,7.295c0.919,1.918,1.595-0.329,1.607-0.78c0.243-8.737,0.768-6.448,0.768-6.448
			c0.511,7.088,1.139,8.689,2.265,8.135c0.853-0.407,0.073-8.506,0.073-8.506c1.461,4.811,2.569,5.577,2.569,5.577
			c2.411,1.693,0.92-2.983,0.585-3.909c-1.784-4.92-1.839-6.625-1.839-6.625c2.229,4.421,3.909,4.257,3.909,4.257
			c2.174-0.694-1.9-6.954-4.287-9.953c-1.218-1.528-2.789-3.574-3.245-4.789c-0.743-2.058-1.304-8.674-1.304-8.674
			c-0.225-7.807-2.155-11.198-2.155-11.198L135,77.6z"
				/>

				<path
					id="chest"
					fill={chestColor}
					stroke="none"
					d="M121,34.3c-8.451-1.258-9.627-3.988-9.627-3.988c-1.79-2.576-0.767-7.514-0.767-7.514
			c1.485-1.208,2.058-4.415,2.058-4.415c2.466-1.891,2.345-4.658,1.206-4.628c-0.914,0.024-0.707-0.733-0.707-0.733
			C115.068,0.636,104.01,0,104.01,0h-1.688c0,0-11.063,0.636-9.523,13.089c0,0,0.207,0.758-0.715,0.733
			c-1.136-0.03-1.242,2.737,1.215,4.628c0,0,0.572,3.206,2.058,4.415c0,0,1.023,4.938-0.767,7.514c0,0-1.172,2.73-9.627,3.988
			L85.3,66L121.265,66L121.8,34.3z"
				/>
				<path
					id="rightupperarm"
					fill={rightUpperArmColor}
					stroke="none"
					d="M85.1,34.3c0,0-8.375,0.082-9.514,11.429l-0.158,16.635c0,0-0.609,9.853-3.922,15.135L83,74.6
					c0,0-0.082-6.54,2.299-10.245c0,0,1.69,18.526,0.545,23.727z"
				/>

				<path
					id="rightlforearm"
					fill={rightForeArmColor}
					stroke="none"
					d="M71.6,77c0,0-1.921,3.392-2.143,11.198
			c0,0-0.563,6.616-1.303,8.674c-0.451,1.209-2.021,3.255-3.249,4.789c-2.408,2.993-6.455,9.24-4.29,9.953
			c0,0,1.689,0.164,3.909-4.257c0,0-0.046,1.693-1.827,6.625c-0.35,0.914-1.839,5.59,0.573,3.909c0,0,1.117-0.767,2.569-5.577
			c0,0-0.779,8.099,0.088,8.506c1.133,0.555,1.751-1.047,2.262-8.135c0,0,0.524-2.289,0.767,6.448
			c0.012,0.451,0.673,2.698,1.596,0.78c0.779-1.608,0.429-5.864,0.429-7.295c0,0,0.999,5.522,1.933,5.522
			c0,0,1.099,1.291,0.648-5.571c-0.073-1.121,0.32-3.422,0.369-4.092l0.106-2.631c0,0-0.274-3.014-0.274-4.269
			c0-0.311,1.078-4.415,3.921-8.747c0,0,5.913-10.488,5.532-17.342L82.8,74z"
				/>

				<path
					id="abdominals"
					fill={abdominalColor}
					stroke="none"
					d="M124.4,112c1.169-9.53-4.141-22.308-4.141-22.308c-1.163-5.2,0.542-23.727,0.542-23.727L85.1,66
			c0,0,1.69,18.526,0.545,23.727c0,0-5.319,12.778-4.146,22.308L104.265,117.959z"
				/>

				<path
					id="righthigh"
					fill={rightThighColor}
					stroke="none"
					d="M81.4,111.5c0.864,7.094,2.53,22.237,4.226,28.217c0.886,3.094,0.362,10.899,1.072,12.848L97.6,154
					c1.245-7.423,3.685-26.373,3.38-29.959l1.008,0.354L101,125L102.265,115z"
				/>

				<path
					id="rightcalf"
					fill={rightCalfColor}
					stroke="none"
					d="M86.8,152L86.8,154c0.32,0.847,0.152,1.627-0.536,3.545c-2.387,6.71-2.083,11.436,3.921,29.24
					c0,0,1.848,3.945,0.914,11.033c0,0-3.836,7.892-1.379,8.05c0,0,0.192,0.523,1.023,0.109c0,0,1.327,1.37,2.761,0.627
					c0,0,1.328,1.06,2.463,0.116c0,0,0.91,1.047,2.237,0.201c0,0,1.742,1.175,2.777-0.098c0,0,1.839,0.408-1.435-7.886
					c0,0-1.254-8.793-1.945-10.522c-1.318-3.275-0.387-12.251-0.106-14.175c0.453-3.216,0.21-8.695-0.618-12.934L97.6,154z"
				/>
			</g>
		</svg>
	);
}
