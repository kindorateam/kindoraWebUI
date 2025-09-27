const SadEmoji = (props: React.SVGProps<SVGSVGElement>) => (
	<svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
			fill="url(#paint0_linear_621_3887)"
		/>
		<path d="M6.38704 14.3479L13.7783 11.9566" stroke="#4F0504" strokeLinecap="round" strokeWidth="1.5" />
		<circle cx="6.16964" cy="7.17391" fill="white" r="2.82609" />
		<circle cx="6.60443" cy="7.17396" fill="#2D2D2D" r="1.70652" stroke="black" strokeWidth="0.5" />
		<circle cx="13.9957" cy="7.17396" fill="white" r="2.82609" />
		<circle cx="13.561" cy="7.17396" fill="#2D2D2D" r="1.70652" stroke="black" strokeWidth="0.5" />
		<defs>
			<linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_621_3887" x1="10" x2="10" y1="0" y2="20">
				<stop stopColor="#F5DC30" />
				<stop offset="1" stopColor="#F89B56" />
			</linearGradient>
		</defs>
	</svg>
)

export default SadEmoji
