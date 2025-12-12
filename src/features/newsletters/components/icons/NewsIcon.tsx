const NewsIcon = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g opacity="0.16">
				<path d="M12 6H12.7C13.9703 6 15 7.02975 15 8.3V13C15 14.1046 14.1046 15 13 15H12V6Z" fill="#393B3F" />
				<path
					d="M1 4C1 2.34315 2.34315 1 4 1H10C11.6569 1 13 2.34315 13 4C13 7.66667 13 11.3333 13 15H3C1.89543 15 1 14.1046 1 13V4Z"
					fill="#393B3F"
				/>
			</g>
			<path
				d="M12 6H12.7C13.9703 6 15 7.02975 15 8.3V13C15 14.1046 14.1046 15 13 15H12V6Z"
				fill="#393B3F"
				opacity="0.16"
			/>
			<path
				clipRule="evenodd"
				d="M10 1C11.6569 1 13 2.34315 13 4V6.02051C14.1284 6.16757 14.9999 7.13136 15 8.2998V13C15 14.0357 14.2128 14.887 13.2041 14.9893L13 15H3C1.96435 15 1.113 14.2128 1.01074 13.2041L1 13V4C1 2.34315 2.34315 1 4 1H10ZM4 2C2.89543 2 2 2.89543 2 4V13C2 13.5523 2.44772 14 3 14H12V4C12 2.89543 11.1046 2 10 2H4ZM13 14C13.5523 14 14 13.5523 14 13V8.2998C13.9999 7.68528 13.5731 7.17166 13 7.03613V14Z"
				fill="#393B3F"
				fillRule="evenodd"
			/>
			<rect height="2" rx="0.5" stroke="#393B3F" width="5" x="4.5" y="4.5" />
			<rect fill="#393B3F" height="1" rx="0.5" width="6" x="4" y="8" />
			<rect fill="#393B3F" height="1" rx="0.5" width="4" x="4" y="10" />
		</svg>
	)
}

export default NewsIcon
