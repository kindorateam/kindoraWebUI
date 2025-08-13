import type { SVGProps } from 'react'

const EditIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 20 20"
    width="1em"
    {...props}
  >
    <path
      d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70835 11.0584 3.65002 11.4334L3.34169 13.75C3.23335 14.5084 3.79168 15.05 4.54168 14.9084L6.85002 14.5084C7.22502 14.4334 7.75835 14.1667 8.02502 13.8917L14.8667 6.65002C16.0334 5.44168 16.55 4.06668 14.7334 2.31668C12.9334 0.591683 11.6 1.12502 10.4334 2.33335L11.05 3.00002Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
    <path
      d="M9.90833 2.86665C10.2667 4.79998 11.8 6.29998 13.75 6.60831"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
    <path
      d="M2.5 18.3333H17.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
  </svg>
)

export default EditIcon
