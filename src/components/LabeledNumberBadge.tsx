import NumberBadge from './NumberBadge'

interface LabeledNumberBadgeProps {
  icon?: React.ReactNode
  label: string
  value?: number
}

const LabeledNumberBadge = ({
  icon,
  label,
  value,
}: LabeledNumberBadgeProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="">{label}</span>
      {!icon && value !== undefined && <NumberBadge value={value} />}
      {icon && <span className="text-brand">{icon}</span>}
    </div>
  )
}

export default LabeledNumberBadge
