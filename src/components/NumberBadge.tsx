import { clsx } from 'clsx'

interface NumberBadgeProps extends React.ComponentProps<'div'> {
  value: number
}

const NumberBadge = ({ className, value, ...props }: NumberBadgeProps) => {
  return (
    <div
      className={clsx('w-7 rounded-lg bg-[#792C410D] text-center', className)}
      {...props}
    >
      <span className="text-wine-700 text-sm font-semibold">{value}</span>
    </div>
  )
}

export default NumberBadge
