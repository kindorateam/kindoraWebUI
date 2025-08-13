import type { SVGProps } from 'react'

const BillingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M20 6H4C2.9 6 2 6.9 2 8V16C2 17.1 2.9 18 4 18H20C21.1 18 22 17.1 22 16V8C22 6.9 21.1 6 20 6ZM20 16H4V12H20V16ZM20 10H4V8H20V10Z"
      fill="currentColor"
    />
  </svg>
)

export default BillingIcon
