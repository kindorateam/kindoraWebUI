import { Card, ProgressBar } from "@heroui/react"
import { useTranslation } from "react-i18next"

import MdiAccountGroup from "~icons/mdi/account-group"
import MdiAccountTie from "~icons/mdi/account-tie"

import { absenteeGroups, heroCardClassName, signedInMetrics, summaryMetrics } from "../constants"

import AvatarStack from "./AvatarStack"

const SummaryMetricCard = () => {
	const { t } = useTranslation()

	return (
		<Card className={`${heroCardClassName} min-h-[190px] p-0`}>
			<div className="grid h-full grid-cols-3 gap-4 p-6">
				{summaryMetrics.map((metric) => {
					const Icon = metric.icon

					return (
						<div className="flex flex-col items-center text-center" key={metric.labelKey}>
							<div className="flex size-10 items-center justify-center rounded-full bg-[#0485f7] text-white">
								<Icon className="size-5" />
							</div>
							<p className="mt-5 font-medium text-[#71717a] text-[12px]">{t(metric.labelKey)}</p>
							<p className="mt-2 font-semibold text-[#18181b] text-[40px] leading-none">{metric.value}</p>
						</div>
					)
				})}
			</div>
		</Card>
	)
}

const SignedInCard = () => {
	const { t } = useTranslation()

	return (
		<Card className={`${heroCardClassName} min-h-[190px] p-0`}>
			<div className="flex h-full flex-col gap-10 p-6">
				<div className="inline-flex w-fit items-center gap-1 rounded-full bg-[#0485f726] px-2.5 py-1 font-medium text-[#0485f7] text-[12px]">
					<MdiAccountGroup className="size-3.5" />
					{t("dashboard.signedIn.title")}
				</div>

				<div className="grid grid-cols-2 gap-8">
					{signedInMetrics.map((metric) => (
						<div key={metric.labelKey}>
							<p className="font-medium text-[#71717a] text-[12px]">{t(metric.labelKey)}</p>
							<div className="mt-2 flex items-end gap-3">
								<p className="font-semibold text-[#18181b] text-[40px] leading-none">{metric.value}</p>
								<p className="pb-1 font-medium text-[#71717a] text-[12px]">
									{t("dashboard.signedIn.ofTotal", { total: metric.total })}
								</p>
							</div>
							<ProgressBar
								aria-label={t("dashboard.signedIn.progressAria", { label: t(metric.labelKey) })}
								className="mt-3 w-[70px]"
								value={(metric.value / metric.total) * 100}
							>
								<ProgressBar.Track className="h-1 bg-[#ebebec]">
									<ProgressBar.Fill className="rounded-full bg-[#0485f7]" />
								</ProgressBar.Track>
							</ProgressBar>
						</div>
					))}
				</div>
			</div>
		</Card>
	)
}

const AbsenteesCard = () => {
	const { t } = useTranslation()

	return (
		<Card className={`${heroCardClassName} min-h-[190px] p-0`}>
			<div className="flex h-full flex-col gap-10 p-6">
				<div className="inline-flex w-fit items-center gap-1 rounded-full bg-[#0485f726] px-2.5 py-1 font-medium text-[#0485f7] text-[12px]">
					<MdiAccountTie className="size-3.5" />
					{t("dashboard.absentees.title")}
				</div>

				<div className="grid grid-cols-2 gap-8">
					{absenteeGroups.map((group) => (
						<div key={group.labelKey}>
							<p className="font-medium text-[#71717a] text-[12px]">{t(group.labelKey)}</p>
							<div className="mt-3">
								<AvatarStack people={group.people} />
							</div>
						</div>
					))}
				</div>
			</div>
		</Card>
	)
}

const SummaryCardsRow = () => (
	<div className="mt-8 grid gap-4 lg:grid-cols-3">
		<SignedInCard />
		<AbsenteesCard />
		<SummaryMetricCard />
	</div>
)

export default SummaryCardsRow
