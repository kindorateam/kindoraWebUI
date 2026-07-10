import { Skeleton } from "@heroui/react"

const MealsScheduleSkeleton = () => (
	<div aria-hidden className="grid gap-6 p-4 sm:p-6">
		{[0, 1].map((day) => (
			<div className="grid gap-4 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6" key={day}>
				<div className="grid content-start gap-2">
					<Skeleton className="h-3 w-14 rounded-md" />
					<Skeleton className="h-6 w-24 rounded-lg" />
				</div>
				<div className="grid gap-3">
					{[0, 1].map((meal) => (
						<div className="rounded-2xl border border-default-200 bg-white p-5" key={meal}>
							<div className="flex gap-4">
								<Skeleton className="size-11 shrink-0 rounded-[14px]" />
								<div className="grid flex-1 gap-2">
									<Skeleton className="h-3 w-36 rounded-md" />
									<Skeleton className="h-6 w-2/3 rounded-lg" />
									<Skeleton className="h-5 w-1/2 rounded-lg" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		))}
	</div>
)

export default MealsScheduleSkeleton
