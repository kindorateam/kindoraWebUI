const HeartEmoji = (props: React.SVGProps<SVGSVGElement>) => (
	<svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg" {...props}>
		<circle cx="10" cy="10" fill="url(#paint0_linear_621_2332)" r="10" />
		<path
			d="M12.3684 6C13.6842 6 15 7.10124 15 8.75309C15 10.4049 14.1228 11.3226 13.6842 11.7815L10.166 14.9363C10.0713 15.0212 9.92867 15.0212 9.83397 14.9363L6.31579 11.7815C5.87719 11.3226 5 10.4049 5 8.75309C5 7.10124 6.31579 6 7.63158 6C8.94737 6 10 7.10124 10 7.92716C10 7.10124 11.0526 6 12.3684 6Z"
			fill="white"
		/>
		<defs>
			<linearGradient
				gradientUnits="userSpaceOnUse"
				id="paint0_linear_621_2332"
				x1="14.1798"
				x2="5.82022"
				y1="-8.95453e-08"
				y2="20"
			>
				<stop stopColor="#D85175" />
				<stop offset="1" stopColor="#B0294D" />
			</linearGradient>
		</defs>
	</svg>
)

export default HeartEmoji
