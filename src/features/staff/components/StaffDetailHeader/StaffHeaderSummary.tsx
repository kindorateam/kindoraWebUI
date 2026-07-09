import { Avatar, Badge, Button, Chip, Separator, Tooltip } from "@heroui/react"
import { useTranslation } from "react-i18next"

import IdentityChip from "@/components/IdentityChip"
import FluentPerson16Filled from "~icons/fluent/person-16-filled"
import GrommetIconsUpdate from "~icons/grommet-icons/update"
import MingcuteSendFill from "~icons/mingcute/send-fill"
import PhSignInBold from "~icons/ph/sign-in-bold"

import { MOCK_ROOMS } from "../../constants"

import type { EmployeeFull } from "../../types"

interface StaffHeaderSummaryProps {
	avatarUrl?: string
	children?: React.ReactNode
	employee?: EmployeeFull
	fullName: string
	onGeneratePin?: () => void
	onSendInvite?: () => void
	onSignOut?: () => void
}

const StaffHeaderSummary = ({
	avatarUrl,
	children,
	employee,
	fullName,
	onGeneratePin,
	onSendInvite,
	onSignOut,
}: StaffHeaderSummaryProps) => {
	const { t } = useTranslation()

	return (
		<div className="mb-8 flex items-start gap-10">
			<div className="relative shrink-0">
				<Badge.Anchor>
					<Avatar className="size-25 shadow-md">
						<Avatar.Image alt={fullName} src={avatarUrl} />
						<Avatar.Fallback className="bg-accent text-white">
							<FluentPerson16Filled className="size-22 text-white" />
						</Avatar.Fallback>
					</Avatar>
					<Badge
						className="h-6! min-h-0! w-6! min-w-0! border-3 border-white"
						color={employee?.checkedIn ? "success" : "danger"}
						placement="bottom-right"
					/>
				</Badge.Anchor>
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-5">
				<div className="flex flex-col gap-1">
					<div className="flex items-start justify-between gap-4">
						<h1 className="font-semibold text-4xl">{fullName}</h1>
						<div className="flex shrink-0 gap-3">
							<Button className="bg-success text-white hover:bg-success/90" onPress={onSendInvite} size="sm">
								<MingcuteSendFill aria-hidden className="size-4" />
								{t("staff.detail.sendInvite")}
							</Button>
							<Button onPress={onSignOut} size="sm" variant="primary">
								<PhSignInBold aria-hidden className="size-4" />
								{t("staff.detail.signOut")}
							</Button>
						</div>
					</div>
					<Separator />
				</div>

				<div className="flex items-center gap-7">
					{employee?.role && (
						<div className="flex items-center gap-2">
							<span>{t("staff.detail.role")}</span>
							<Chip
								className="bg-[#792C410D] px-3 py-1 text-sm capitalize"
								style={{ color: "var(--colors-base-secondary, #7828C8)" }}
								variant="soft"
							>
								{employee.role}
							</Chip>
						</div>
					)}

					{employee?.pinCode != null && (
						<div className="flex items-center gap-2">
							<span>{t("staff.detail.pin")}</span>
							<Chip
								className="bg-[#792C410D] px-3 py-1 font-medium text-sm"
								style={{ color: "var(--colors-base-secondary, #7828C8)" }}
								variant="soft"
							>
								{employee.pinCode}
							</Chip>
							<Tooltip delay={0}>
								<Button
									aria-label={t("staff.detail.generatePin")}
									className="rounded-full"
									isIconOnly
									onPress={onGeneratePin}
									size="sm"
									variant="primary"
								>
									<GrommetIconsUpdate className="size-4" />
								</Button>
								<Tooltip.Content>{t("staff.detail.generatePin")}</Tooltip.Content>
							</Tooltip>
						</div>
					)}

					{/* TODO: Replace mock rooms with employee room data from the API. */}
					<div className="flex items-center gap-2">
						<span className="shrink-0">{t("staff.detail.rooms")}</span>
						<div className="flex min-w-0 items-center gap-2">
							{MOCK_ROOMS.slice(0, 2).map((room) => (
								<IdentityChip fallbackIcon="room" fullName={room.label} key={room.key} src={room.avatar || undefined} />
							))}
							{MOCK_ROOMS.length > 2 && (
								<Tooltip delay={0}>
									<Button className="h-7 min-w-0 rounded-full px-3" size="sm" variant="secondary">
										+{MOCK_ROOMS.length - 2}
									</Button>
									<Tooltip.Content className="flex flex-col gap-2 p-3">
										{MOCK_ROOMS.slice(2).map((room) => (
											<IdentityChip
												fallbackIcon="room"
												fullName={room.label}
												key={room.key}
												src={room.avatar || undefined}
											/>
										))}
									</Tooltip.Content>
								</Tooltip>
							)}
						</div>
					</div>
				</div>
				{children}
			</div>
		</div>
	)
}

export default StaffHeaderSummary
