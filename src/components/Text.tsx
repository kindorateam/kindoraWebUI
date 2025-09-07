import clsx from 'clsx'

type TextTag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type TextSize = 12 | 14 | 16 | 18 | 20 | 24 | 30 | 34

const sizeClassMap: Record<TextSize, string> = {
  12: 'text-xs',
  14: 'text-sm',
  16: 'text-base',
  18: 'text-lg',
  20: 'text-xl',
  24: 'text-2xl',
  30: 'text-3xl',
  34: 'text-4xl',
}

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextTag
  size?: TextSize
}

const Text = ({
  as: Tag = 'span',
  size = 16,
  className,
  children,
  ...props
}: TextProps) => {
  const sizeClass = sizeClassMap[(size as TextSize) ?? 16] ?? 'text-base'

  return (
    <Tag className={clsx(sizeClass, className)} {...props}>
      {children}
    </Tag>
  )
}

export default Text

