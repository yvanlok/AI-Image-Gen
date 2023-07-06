import React, { useEffect, useRef } from "react";

export default function Banner(): JSX.Element {
	const banner = useRef<HTMLDivElement | null>(null);

	const atOptions = {
		key: "ef9712c762ff4879fed44c7c659bb9be",
		format: "iframe",
		height: 90,
		width: 728,
		params: {},
	};

	useEffect(() => {
		if (banner.current && !banner.current.firstChild) {
			const conf = document.createElement("script");
			const script = document.createElement("script");
			script.type = "text/javascript";
			script.src = `//www.highperformancedformats.com/${atOptions.key}/invoke.js`;
			conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

			banner.current.append(conf);
			banner.current.append(script);
		}
	}, []);

	return (
		<div
			className="mx-2 my-5 border border-gray-200 justify-center items-center text-white text-center"
			ref={banner}
		></div>
	);
}

export { Banner };
