import { Link } from "@heroui/react"
import { type MouseEvent, useEffect, useState } from "react"

import Button from "./Button"
import StaffCard from "./StaffCard"
import Text from "./Text"

const STAFF_SECTIONS = [
	{ id: "personal-info", label: "Personal info" },
	{ id: "address", label: "Address" },
	{ id: "role-status", label: "Role & status" },
	{ id: "medical-info", label: "Medical info" },
	{ id: "emergency-contact", label: "Emergency contact" },
	{ id: "certification", label: "Certification" },
	{ id: "scheduled-absence", label: "Scheduled absence" },
] as const

const STICKY_NAV_TOP = 96 // matches header height (h-20 = 80px) + spacing
const SECTION_SCROLL_MARGIN = STICKY_NAV_TOP + 24 // keep cards clear of sticky nav
const DEFAULT_SECTION_ID = STAFF_SECTIONS[0].id
type StaffSectionId = (typeof STAFF_SECTIONS)[number]["id"]

const StaffProfileTab = () => {
	const [activeSection, setActiveSection] = useState<StaffSectionId>(DEFAULT_SECTION_ID)

	useEffect(() => {
		if (typeof window === "undefined") {
			return undefined
		}

		const handleScroll = () => {
			const scrollPosition = window.scrollY + SECTION_SCROLL_MARGIN

			let nextActive: StaffSectionId = DEFAULT_SECTION_ID

			for (const section of STAFF_SECTIONS) {
				const element = document.getElementById(section.id)

				if (!element) {
					continue
				}

				const elementTop = element.getBoundingClientRect().top + window.scrollY

				if (scrollPosition >= elementTop) {
					nextActive = section.id
				} else {
					break
				}
			}

			setActiveSection((prev) => (prev === nextActive ? prev : nextActive))
		}

		handleScroll()

		window.addEventListener("scroll", handleScroll, { passive: true })

		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	const handleSectionClick = (id: StaffSectionId) => (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		const element = document.getElementById(id)

		if (!element) {
			return
		}

		element.scrollIntoView({ behavior: "smooth", block: "start" })
		setActiveSection(id)
	}

	return (
		<div className="grid grid-cols-12 gap-4">
			<div className="col-span-9 space-y-7">
				<StaffCard
					cardProps={{
						id: "personal-info",
						style: { scrollMarginTop: SECTION_SCROLL_MARGIN },
					}}
					footer={
						<div className="flex gap-2.5">
							<Button color="secondary">Deactivate account</Button>
							<Button color="secondary">Edit</Button>
						</div>
					}
					footerProps={{
						className: "justify-end",
					}}
					title="Personal info"
				>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Name
						</Text>
						<Text color="black" size={14}>
							Mia
						</Text>
					</div>

					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Email
						</Text>
						<Link href="mailto:mia@example.com">
							<Text as="span" color="brand" size={14}>
								j.hayes@example.com
							</Text>
						</Link>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Phone
						</Text>
						<Link href="tel:+1234567890">
							<Text as="span" color="black" size={14}>
								(234) 567-890
							</Text>
						</Link>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							DOB
						</Text>
						<Text color="black" size={14}>
							Jun 16, 1988
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Age
						</Text>
						<Text color="black" size={14}>
							35
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Gender
						</Text>
						<Text color="black" size={14}>
							Female
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Race
						</Text>
						<Text color="black" size={14}>
							White
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Ethnicity
						</Text>
						<Text color="black" size={14}>
							Not Hispanic or Latino
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Notes
						</Text>
						<Text color="black" size={14}>
							-
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Enroll date
						</Text>
						<Text color="black" size={14}>
							08.15.2025
						</Text>
					</div>
				</StaffCard>
				<StaffCard
					cardProps={{
						id: "address",
						style: { scrollMarginTop: SECTION_SCROLL_MARGIN },
					}}
					footer={
						<div className="flex gap-2.5">
							<Button color="secondary">Edit</Button>
						</div>
					}
					footerProps={{
						className: "justify-end",
					}}
					title="Address"
				>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Address
						</Text>
						<Text color="black" size={14}>
							123 Main St, Springfield, USA
						</Text>
					</div>
				</StaffCard>
				<StaffCard
					cardProps={{
						id: "role-status",
						style: { scrollMarginTop: SECTION_SCROLL_MARGIN },
					}}
					footer={
						<div className="flex gap-2.5">
							<Button color="secondary">Edit</Button>
						</div>
					}
					footerProps={{
						className: "justify-end",
					}}
					title="Role & status"
				>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Role
						</Text>
						<Text color="black" size={14}>
							Lead teacher
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Status
						</Text>
						<Text color="black" size={14}>
							Full-time
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Hire date
						</Text>
						<Text color="black" size={14}>
							Jan 05, 2022
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Supervisor
						</Text>
						<Text color="black" size={14}>
							Sofia Thompson
						</Text>
					</div>
				</StaffCard>
				<StaffCard
					cardProps={{
						id: "medical-info",
						style: { scrollMarginTop: SECTION_SCROLL_MARGIN },
					}}
					footer={
						<div className="flex gap-2.5">
							<Button color="secondary">Edit</Button>
						</div>
					}
					footerProps={{
						className: "justify-end",
					}}
					title="Medical Info"
				>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Allergies
						</Text>
						<Text color="black" size={14}>
							Nutes, Fish
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Medications
						</Text>
						<Text color="black" size={14}>
							-
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Doctor
						</Text>
						<Text color="black" size={14}>
							Alexander Johns
						</Text>
					</div>

					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Phone
						</Text>
						<Link href="tel:+1234567890">
							<Text as="span" color="black" size={14}>
								(234) 567-890
							</Text>
						</Link>
					</div>
				</StaffCard>

				<StaffCard
					cardProps={{
						id: "emergency-contact",
						style: { scrollMarginTop: SECTION_SCROLL_MARGIN },
					}}
					footer={
						<div className="flex gap-2.5">
							<Button color="secondary">Edit</Button>
						</div>
					}
					footerProps={{
						className: "justify-end",
					}}
					title="Emergency contact"
				>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Name
						</Text>
						<Text color="black" size={14}>
							Jason Statham
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Phone
						</Text>
						<Link href="tel:+1234567890">
							<Text as="span" color="black" size={14}>
								(234) 567-890
							</Text>
						</Link>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Relationship to staff
						</Text>
						<Text color="black" size={14}>
							Dad
						</Text>
					</div>
				</StaffCard>
				<StaffCard
					cardProps={{
						id: "certification",
						style: { scrollMarginTop: SECTION_SCROLL_MARGIN },
					}}
					footer={
						<div className="flex gap-2.5">
							<Button color="secondary">Edit</Button>
						</div>
					}
					footerProps={{
						className: "justify-end",
					}}
					title="Certification"
				>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Degree
						</Text>
						<Text color="black" size={14}>
							Ph.D. degree
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							Certification
						</Text>
						<Text as="span" color="black" size={14}>
							0-00
						</Text>
					</div>
					<div className="flex items-center gap-20">
						<Text color="neutral-600" size={12}>
							ECE credits
						</Text>
						<Text color="black" size={14}>
							1000
						</Text>
					</div>
				</StaffCard>
				<StaffCard
					cardProps={{
						id: "scheduled-absence",
						style: { scrollMarginTop: SECTION_SCROLL_MARGIN },
					}}
					footer={
						<div className="flex gap-2.5">
							<Button color="secondary">Mark absent</Button>
						</div>
					}
					footerProps={{
						className: "justify-end",
					}}
					title="Scheduled absence"
				>
					<div className="flex items-center justify-between gap-4">
						<div>
							<Text color="black" size={14} weight="semibold">
								Winter break
							</Text>
							<Text color="neutral-600" size={12}>
								Dec 24 – Dec 28, 2024
							</Text>
						</div>
						<Text color="neutral-600" size={12}>
							Approved
						</Text>
					</div>
					<div className="flex items-center justify-between gap-4">
						<div>
							<Text color="black" size={14} weight="semibold">
								Conference
							</Text>
							<Text color="neutral-600" size={12}>
								Mar 12 – Mar 13, 2025
							</Text>
						</div>
						<Text color="neutral-600" size={12}>
							Pending
						</Text>
					</div>
				</StaffCard>
			</div>
			<div className="col-span-3">
				<nav
					aria-label="Staff profile sections"
					className="sticky rounded-[20px] bg-black/2 p-6"
					style={{ top: `${STICKY_NAV_TOP}px` }}
				>
					<div className="flex flex-col gap-2">
						{STAFF_SECTIONS.map(({ id, label }) => {
							const isActive = activeSection === id

							return (
								<button
									aria-current={isActive ? "true" : undefined}
									className={`group flex w-full items-center border-l py-2 pl-4 text-left transition-colors ${
										isActive ? "border-brand" : "border-transparent hover:border-neutral-200"
									}`}
									key={id}
									onClick={handleSectionClick(id)}
									type="button"
								>
									<Text
										className={isActive ? undefined : "group-hover:text-brand"}
										color={isActive ? "brand" : "neutral-600"}
										size={14}
										weight={isActive ? "semibold" : "regular"}
									>
										{label}
									</Text>
								</button>
							)
						})}
					</div>
				</nav>
			</div>
		</div>
	)
}

export default StaffProfileTab
