interface SignedInTooltipPerson {
	id: string
	name: string
}

interface SignedInTooltipContentProps {
	label: string
	items: SignedInTooltipPerson[]
}

const SignedInTooltipContent = ({ label, items }: SignedInTooltipContentProps) => {
	return (
		<div className="max-w-75 p-2 pe-0">
			<p className="font-medium text-sm">{label}</p>
			<p className="text-default-500 text-xs">{items.length} signed in</p>
			<div className="mt-2 max-h-64 overflow-auto text-sm">
				<ul className="list-disc ps-4 pe-2">
					{items.map((item) => (
						<li key={item.id}>{item.name}</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default SignedInTooltipContent
