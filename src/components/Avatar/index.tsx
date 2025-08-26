import { AvatarProps } from './avatar.types'

const Avatar = ({ alt, border, src, size }: AvatarProps) => {
  const borderClass = border ? `border-[3px]` : ''

  return (
    <div className={`h-[${size}px] w-[${size}px] rounded-full ${borderClass}`}>
      <img alt={alt} src={src} />
    </div>
  )
}

export default Avatar
