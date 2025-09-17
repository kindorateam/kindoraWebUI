import type { SVGProps } from 'react'

const HeartEmoji = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="10" cy="10" fill="url(#paint0_linear_621_3906)" r="10" />
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint0_linear_621_3906"
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
