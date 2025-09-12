import clsx from 'clsx'

type TextTag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type TextSize = 12 | 14 | 16 | 18 | 20 | 24 | 30 | 36

type TextWeightString =
  | 'thin' // 100
  | 'extralight' // 200
  | 'light' // 300
  | 'normal' // 400
  | 'medium' // 500
  | 'semibold' // 600
  | 'bold' // 700
  | 'extrabold' // 800
  | 'black' // 900
type TextWeightNumber = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
type TextWeight = TextWeightString | TextWeightNumber

type TextColor =
  | 'brand'
  | 'neutral-800'
  | 'neutral-700'
  | 'neutral-600'
  | 'neutral-500'

const sizeClassMap: Record<TextSize, string> = {
  12: 'text-xs',
  14: 'text-sm',
  16: 'text-base',
  18: 'text-lg',
  20: 'text-xl',
  24: 'text-2xl',
  30: 'text-3xl',
  36: 'text-4xl',
}

const weightNumberToName: Record<TextWeightNumber, TextWeightString> = {
  100: 'thin',
  200: 'extralight',
  300: 'light',
  400: 'normal',
  500: 'medium',
  600: 'semibold',
  700: 'bold',
  800: 'extrabold',
  900: 'black',
}

const colorClassMap: Record<TextColor, string> = {
  brand: 'text-brand',
  'neutral-800': 'text-neutral-800',
  'neutral-700': 'text-neutral-700',
  'neutral-600': 'text-neutral-600',
  'neutral-500': 'text-neutral-500',
}

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextTag
  size?: TextSize
  weight?: TextWeight
  color?: TextColor
}

const Text = ({
  as: Tag = 'span',
  size = 16,
  weight,
  color = 'neutral-800',
  className,
  children,
  ...props
}: TextProps) => {
  const sizeClass = sizeClassMap[size] ?? 'text-base'
  const weightName =
    typeof weight === 'number' ? weightNumberToName[weight] : weight
  const weightClass = weightName ? `font-${weightName}` : undefined
  const colorClass = colorClassMap[color] ?? 'text-neutral-800'

  return (
    <Tag
      className={clsx(sizeClass, weightClass, colorClass, className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

export type { TextProps, TextSize, TextWeight, TextColor }
export default Text
