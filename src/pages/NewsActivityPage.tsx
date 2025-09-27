import Chat from "@/components/Chat/Chat"
import SubHeader from "@/components/SubHeader"

const NewsActivityPage = () => {
	return (
		<div>
			<SubHeader title="News Activity" />
			<div className="container max-w-4xl pt-10">
				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-4"></div>
					<div className="col-span-8">
						<Chat />
					</div>
				</div>
			</div>
		</div>
	)
}

export default NewsActivityPage
