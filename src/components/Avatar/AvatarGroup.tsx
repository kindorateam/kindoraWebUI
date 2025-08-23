import type { AvatarGroupProps } from './avatar.types'

const AvatarGroup = ({ children }: AvatarGroupProps) => {
  return <div className="position-relative flex">{children}</div>
}

export default AvatarGroup
