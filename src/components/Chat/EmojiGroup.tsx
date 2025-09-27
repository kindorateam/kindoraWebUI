import HeartEmoji from "../icons/emojies/HeartEmoji"
import LaughEmoji from "../icons/emojies/LaughEmoji"
import SadEmoji from "../icons/emojies/SadEmoji"

const EmojiGroup = () => {
	return (
		<div className="flex">
			<HeartEmoji className="z-4" />
			<LaughEmoji className="z-3 ms-[-6px]" />
			<SadEmoji className="z-2 ms-[-6px]" />
		</div>
	)
}

export default EmojiGroup
