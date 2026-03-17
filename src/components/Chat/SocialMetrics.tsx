import MdiMessageOutline from "~icons/mdi/message-outline"
import MdiThumbUpOutline from "~icons/mdi/thumb-up-outline"

import InlineStat from "./InlineStat"

const SocialMetrics = () => (
	<div className="flex items-center gap-4">
		<InlineStat count={21} icon={<MdiThumbUpOutline />} label="Likes" />
		<InlineStat
			count={8}
			icon={<MdiMessageOutline className="rotate-[-90deg]" height={20.5} width={20.5} />}
			label="Comments"
		/>
	</div>
)

export default SocialMetrics
