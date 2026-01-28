import { Card, CardBody } from "@heroui/react"

import TwemojiEmptyNest from "~icons/twemoji/empty-nest"

const StudentsEmptyState = () => {
	return (
		<Card className="mx-auto w-full max-w-[351px]">
			<CardBody className="items-center gap-5 px-7 py-8 text-center">
				<div className="relative h-[89px] w-20 overflow-clip">
					<TwemojiEmptyNest aria-hidden className="size-full text-primary" />
				</div>

				<div className="flex flex-col gap-5">
					<h3 className="font-semibold text-3xl leading-9">No students added yet</h3>
					<p className="text-default-700 text-lg leading-7">Please add your first student to get started.</p>
				</div>
			</CardBody>
		</Card>
	)
}

export default StudentsEmptyState
