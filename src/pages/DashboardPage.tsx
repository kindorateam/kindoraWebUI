import useAuth from "@/features/auth/hooks/useAuth"
import DashboardPanelsGrid from "@/features/dashboard/components/DashboardPanelsGrid"
import SummaryCardsRow from "@/features/dashboard/components/SummaryCardsRow"
import { getFirstName } from "@/features/dashboard/utils"

const DashboardPage = () => {
	const { user } = useAuth()
	const firstName = user?.givenName ?? getFirstName(user?.name)

	return (
		<div className="min-h-full bg-[#f7f7f2]">
			<section className="relative overflow-hidden">
				<div className="absolute inset-x-0 top-0 h-[300px] border-[rgba(0,0,0,0.05)] border-b bg-[#0485f7]" />

				<div className="relative mx-auto max-w-[1230px] px-4 pb-12 sm:px-6">
					<div className="pt-10" data-dashboard-header-trigger>
						<h1 className="font-medium text-[34px] text-white leading-none tracking-[-0.02em] sm:mt-4 sm:text-[42px]">
							Welcome back, <span className="font-semibold">{firstName}!</span>
						</h1>
					</div>

					<SummaryCardsRow />
					<DashboardPanelsGrid />
				</div>
			</section>
		</div>
	)
}

export default DashboardPage
