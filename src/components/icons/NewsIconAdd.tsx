const NewsIconAdd = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.5 9C12.7761 9 13 9.22386 13 9.5V12H15.5C15.7761 12 16 12.2239 16 12.5C16 12.7761 15.7761 13 15.5 13H13V15.5C13 15.7761 12.7761 16 12.5 16C12.2239 16 12 15.7761 12 15.5V13H9.5C9.22386 13 9 12.7761 9 12.5C9 12.2239 9.22386 12 9.5 12H12V9.5C12 9.22386 12.2239 9 12.5 9Z"
        fill="white"
      />
      <path
        d="M10 1C11.6569 1 13 2.34315 13 4V8.08691C12.8435 8.03153 12.6755 8 12.5 8C11.6716 8 11 8.67157 11 9.5V11H9.5C8.72334 11 8.08461 11.5903 8.00781 12.3467L8 12.5V12.6611C8 14.5078 8 14.9979 8.00781 15H4C3 15 1 14 1 12V4C1 2.34315 2.34315 1 4 1H10Z"
        fill="white"
        opacity="0.16"
      />
      <rect height="2" rx="0.5" stroke="white" width="5" x="4.5" y="4.5" />
      <rect fill="white" height="1" rx="0.5" width="6" x="4" y="8" />
      <rect fill="white" height="1" rx="0.5" width="4" x="4" y="10" />
      <path
        d="M10 1C11.6569 1 13 2.34315 13 4V8H12V4C12 2.89543 11.1046 2 10 2H4C2.89543 2 2 2.89543 2 4V12C2 13.1046 2.89543 14 4 14H8V15H4C2.39489 15 1.08421 13.7394 1.00391 12.1543L1 12V4C1 2.34315 2.34315 1 4 1H10Z"
        fill="white"
      />
    </svg>
  )
}

export default NewsIconAdd
