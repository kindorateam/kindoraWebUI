import InlineStat from './InlineStat'
import LikeIcon from '@/components/icons/LikeIcon'
import MessageIcon from '@/components/icons/MessageIcon'

const SocialMetrics = () => (
  <div className="flex items-center gap-4">
    <InlineStat count={21} icon={<LikeIcon />} label="Likes" />
    <InlineStat
      count={8}
      icon={
        <MessageIcon className="rotate-[-90deg]" height={20.5} width={20.5} />
      }
      label="Comments"
    />
  </div>
)

export default SocialMetrics
