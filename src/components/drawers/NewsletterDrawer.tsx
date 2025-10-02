import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Tab, Tabs } from "@heroui/react"
import { useCallback } from "react"

import Button from "@/components/Button"
import Text from "@/components/Text"

interface NewsletterDrawerProps {
	isOpen: boolean
	onClose: () => void
}

const NewsletterDrawer = ({ isOpen, onClose }: NewsletterDrawerProps) => {
	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (!open) {
				onClose()
			}
		},
		[onClose],
	)

	return (
		<Drawer
			backdrop="blur"
			hideCloseButton
			isDismissable
			isOpen={isOpen}
			onOpenChange={handleOpenChange}
			placement="right"
			size="5xl"
		>
			<DrawerContent>
				<DrawerHeader className="flex justify-between gap-2 bg-black/2 ps-14 pe-7.5 pt-10.5 pb-7">
					<Text as="h2" size={30} weight={"bold"}>
						Create newsletter
					</Text>
					<div>
						<Text as="span" color="neutral-700" size={30} weight={"light"}>
							1
						</Text>
						<Text as="span" color="neutral-500" size={20} weight={"light"}>
							of 2
						</Text>
					</div>
				</DrawerHeader>

				<DrawerBody className="flex flex-row gap-10 overflow-y-hidden py-6">
					<div className="max-w-[232px] w-full! overscroll-contain">
						<Tabs
							aria-label="Room details tabs"
							classNames={{
								tabList: "p-0 gap-7",
								cursor: "w-full bg-brand",
								tab: "p-0 pb-5",
								tabContent: "group-data-[selected=true]:text-brand text-neutral-700 font-medium",
							}}
							// selectedKey={"layout"}
							variant="underlined"
						>
							<Tab key="layout" title="Layout">
								<div className="grid grid-cols-2 gap-3.5">
									<div className="grid h-[90px] w-[106px] place-items-center bg-white!">
										<svg width="52" height="38" viewBox="0 0 52 38" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect
												x="2.5"
												y="20.5"
												width="47"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="11.5"
												y="28.5"
												width="29"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="7.5"
												y="36.5"
												width="37"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<path
												d="M48.6142 9.68467C46.555 9.68467 45.2284 8.30871 45.2284 6.03969V6.02646C45.2284 3.77729 46.5748 2.38809 48.6076 2.38809C50.647 2.38809 52 3.76406 52 6.02646V6.03969C52 8.31532 50.6668 9.68467 48.6142 9.68467ZM48.6208 8.35502C49.657 8.35502 50.3236 7.50827 50.3236 6.03969V6.02646C50.3236 4.5645 49.6504 3.72437 48.6076 3.72437C47.5846 3.72437 46.9048 4.57111 46.9048 6.02646V6.03969C46.9048 7.51488 47.5714 8.35502 48.6208 8.35502Z"
												fill="#AEAEAE"
											/>
											<path
												d="M40.8724 12C39.0178 12 37.8496 11.1533 37.6516 10.0551L37.6384 9.99559H39.2554L39.2752 10.0485C39.4534 10.452 40.0144 10.7563 40.8724 10.7563C41.9416 10.7563 42.529 10.1874 42.529 9.29438V8.28225H42.496C42.1066 9.02977 41.3146 9.50606 40.3114 9.50606C38.5558 9.50606 37.4272 8.15656 37.4272 5.97354V5.96692C37.4272 3.75083 38.569 2.38809 40.3378 2.38809C41.3278 2.38809 42.0934 2.91731 42.4894 3.72437H42.529V2.53363H44.1724V9.3473C44.1724 10.935 42.8986 12 40.8724 12ZM40.8262 8.23594C41.8492 8.23594 42.5356 7.36935 42.5356 6.00662V6C42.5356 4.64388 41.8426 3.77729 40.8262 3.77729C39.7702 3.77729 39.1036 4.63065 39.1036 5.99338V6C39.1036 7.38258 39.7702 8.23594 40.8262 8.23594Z"
												fill="#AEAEAE"
											/>
											<path
												d="M33.2757 9.68467C31.2165 9.68467 29.8899 8.30871 29.8899 6.03969V6.02646C29.8899 3.77729 31.2363 2.38809 33.2691 2.38809C35.3085 2.38809 36.6616 3.76406 36.6616 6.02646V6.03969C36.6616 8.31532 35.3284 9.68467 33.2757 9.68467ZM33.2823 8.35502C34.3185 8.35502 34.9851 7.50827 34.9851 6.03969V6.02646C34.9851 4.5645 34.3119 3.72437 33.2691 3.72437C32.2461 3.72437 31.5663 4.57111 31.5663 6.02646V6.03969C31.5663 7.51488 32.2329 8.35502 33.2823 8.35502Z"
												fill="#AEAEAE"
											/>
											<path d="M27.1387 9.54576V0H28.7821V9.54576H27.1387Z" fill="#AEAEAE" />
											<path
												d="M22.4457 9.54633V2.53421H24.0891V3.74479H24.1221C24.3399 2.89804 24.9207 2.38867 25.7259 2.38867C25.9305 2.38867 26.1219 2.42175 26.2473 2.45482V3.94325C26.1087 3.89033 25.8579 3.85063 25.5807 3.85063C24.6501 3.85063 24.0891 4.43939 24.0891 5.47798V9.54633H22.4457Z"
												fill="#CCCCCC"
											/>
											<path
												d="M17.2788 9.68525C15.741 9.68525 14.8632 8.69297 14.8632 7.06563V2.53421H16.5066V6.74148C16.5066 7.73377 16.9686 8.29606 17.9058 8.29606C18.8496 8.29606 19.4502 7.61469 19.4502 6.59595V2.53421H21.0937V9.54633H19.4502V8.44821H19.4172C19.0542 9.19573 18.3348 9.68525 17.2788 9.68525Z"
												fill="#CCCCCC"
											/>
											<path
												d="M10.4535 9.68525C8.39428 9.68525 7.06767 8.30929 7.06767 6.04027V6.02704C7.06767 3.77787 8.41408 2.38867 10.4469 2.38867C12.4863 2.38867 13.8393 3.76464 13.8393 6.02704V6.04027C13.8393 8.3159 12.5061 9.68525 10.4535 9.68525ZM10.4601 8.3556C11.4963 8.3556 12.1629 7.50885 12.1629 6.04027V6.02704C12.1629 4.56508 11.4897 3.72495 10.4469 3.72495C9.42388 3.72495 8.74408 4.57169 8.74408 6.02704V6.04027C8.74408 7.51546 9.41068 8.3556 10.4601 8.3556Z"
												fill="#CCCCCC"
											/>
											<path
												d="M1.5246 11.8749C1.2078 11.8749 0.877802 11.8352 0.679802 11.8021V10.5452C0.805202 10.5717 0.996602 10.6048 1.2276 10.6048C1.8546 10.6048 2.20441 10.4262 2.41561 9.8374L2.51461 9.55295L0 2.53421H1.7952L3.43201 8.14391H3.47821L5.12161 2.53421H6.85082L4.33621 9.78448C3.80161 11.3258 2.98321 11.8749 1.5246 11.8749Z"
												fill="#CCCCCC"
											/>
										</svg>
									</div>
									<div className="grid h-[90px] w-[106px] place-items-center bg-white">
										<Text as="p" color="neutral-700" size={14}>
											Heading
										</Text>
									</div>
									<div className="grid h-[90px] w-[106px] place-items-center bg-white">
										<svg width="46" height="36" viewBox="0 0 46 36" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect
												x="0.5"
												y="0.5"
												width="44.9999"
												height="34.9996"
												rx="5.5"
												fill="#C2C2C2"
												fill-opacity="0.2"
												stroke="#CCCCCC"
											/>
											<path
												d="M6.95312 20.1377C8.56657 19.1617 10.5675 19.0811 12.2549 19.9229L41.1934 34.3584L40.9961 34.498C40.0696 35.1499 38.9639 35.5 37.8311 35.5H5.5C2.73865 35.5 0.500115 33.2613 0.5 30.5V24.041L6.95312 20.1377Z"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<path
												d="M28.3887 14.3477C30.0711 13.2574 32.2139 13.1692 33.9805 14.1172L45.501 20.2988V30C45.5008 33.0374 43.0384 35.4999 40.001 35.5H8.01855C5.34111 35.5 2.89684 34.0187 1.64941 31.6758L28.3887 14.3477Z"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<circle cx="13.5" cy="10.5" r="4" fill="#C2C2C2" fill-opacity="0.5" stroke="#CCCCCC" />
										</svg>
									</div>
									<div className="grid h-[90px] w-[106px] place-items-center bg-white">
										<svg width="112" height="96" viewBox="0 0 112 96" fill="none" xmlns="http://www.w3.org/2000/svg">
											<g filter="url(#filter0_d_25_6552)">
												<rect x="3" y="2" width="106" height="90" rx="14" fill="white" />
												<rect
													x="32.5"
													y="46.5"
													width="47"
													height="1"
													rx="0.5"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
											</g>
											<defs>
												<filter
													id="filter0_d_25_6552"
													x="0"
													y="0"
													width="112"
													height="96"
													filterUnits="userSpaceOnUse"
													color-interpolation-filters="sRGB"
												>
													<feFlood flood-opacity="0" result="BackgroundImageFix" />
													<feColorMatrix
														in="SourceAlpha"
														type="matrix"
														values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
														result="hardAlpha"
													/>
													<feOffset dy="1" />
													<feGaussianBlur stdDeviation="1.5" />
													<feComposite in2="hardAlpha" operator="out" />
													<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.23 0" />
													<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_25_6552" />
													<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_25_6552" result="shape" />
												</filter>
											</defs>
										</svg>
									</div>
									<div className="grid h-[90px] w-[106px] place-items-center bg-white">
										<div>
											{" "}
											<svg width="38" height="30" viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
												<rect
													x="0.5"
													y="0.5"
													width="36.9998"
													height="29"
													rx="5.5"
													fill="#C2C2C2"
													fill-opacity="0.2"
													stroke="#CCCCCC"
												/>
												<path
													d="M5.28125 17.1631C6.90322 16.1734 8.92089 16.0912 10.6182 16.9453L33.8584 28.6396C32.9778 29.1997 31.9547 29.5 30.9072 29.5H5.5C2.73858 29.5 0.500001 27.2614 0.5 24.5V20.0801L5.28125 17.1631Z"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
												<path
													d="M22.9629 12.376C24.6536 11.2707 26.8144 11.1811 28.5908 12.1426L37.499 16.9639V24C37.499 27.0376 35.0366 29.5 31.999 29.5H6.65234C4.4827 29.5 2.50069 28.3104 1.47363 26.4248L22.9629 12.376Z"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
												<circle cx="11.3496" cy="8.75" r="3.25" fill="#C2C2C2" fill-opacity="0.5" stroke="#CCCCCC" />
											</svg>
										</div>
										<div>
											<svg width="38" height="14" viewBox="0 0 38 14" fill="none" xmlns="http://www.w3.org/2000/svg">
												<rect
													x="0.5"
													y="6.5"
													width="29"
													height="1"
													rx="0.5"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
												<rect
													x="0.5"
													y="0.5"
													width="33"
													height="1"
													rx="0.5"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
												<rect
													x="0.5"
													y="12.5"
													width="37"
													height="1"
													rx="0.5"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
											</svg>
										</div>
									</div>
									<div className="grid h-[90px] w-[106px] place-items-center bg-white">
										<svg width="48" height="42" viewBox="0 0 48 42" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect
												x="0.5"
												y="0.5"
												width="47"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="0.5"
												y="24.5"
												width="47"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="0.5"
												y="8.5"
												width="32"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="0.5"
												y="32.5"
												width="32"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="0.5"
												y="16.5"
												width="40"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="0.5"
												y="40.5"
												width="40"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
										</svg>
									</div>
									<div className="grid h-[90px] w-[106px] place-items-center bg-white!">
										<svg width="52" height="38" viewBox="0 0 52 38" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect
												x="2.5"
												y="20.5"
												width="47"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="11.5"
												y="28.5"
												width="29"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="7.5"
												y="36.5"
												width="37"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<path
												d="M48.6142 9.68467C46.555 9.68467 45.2284 8.30871 45.2284 6.03969V6.02646C45.2284 3.77729 46.5748 2.38809 48.6076 2.38809C50.647 2.38809 52 3.76406 52 6.02646V6.03969C52 8.31532 50.6668 9.68467 48.6142 9.68467ZM48.6208 8.35502C49.657 8.35502 50.3236 7.50827 50.3236 6.03969V6.02646C50.3236 4.5645 49.6504 3.72437 48.6076 3.72437C47.5846 3.72437 46.9048 4.57111 46.9048 6.02646V6.03969C46.9048 7.51488 47.5714 8.35502 48.6208 8.35502Z"
												fill="#AEAEAE"
											/>
											<path
												d="M40.8724 12C39.0178 12 37.8496 11.1533 37.6516 10.0551L37.6384 9.99559H39.2554L39.2752 10.0485C39.4534 10.452 40.0144 10.7563 40.8724 10.7563C41.9416 10.7563 42.529 10.1874 42.529 9.29438V8.28225H42.496C42.1066 9.02977 41.3146 9.50606 40.3114 9.50606C38.5558 9.50606 37.4272 8.15656 37.4272 5.97354V5.96692C37.4272 3.75083 38.569 2.38809 40.3378 2.38809C41.3278 2.38809 42.0934 2.91731 42.4894 3.72437H42.529V2.53363H44.1724V9.3473C44.1724 10.935 42.8986 12 40.8724 12ZM40.8262 8.23594C41.8492 8.23594 42.5356 7.36935 42.5356 6.00662V6C42.5356 4.64388 41.8426 3.77729 40.8262 3.77729C39.7702 3.77729 39.1036 4.63065 39.1036 5.99338V6C39.1036 7.38258 39.7702 8.23594 40.8262 8.23594Z"
												fill="#AEAEAE"
											/>
											<path
												d="M33.2757 9.68467C31.2165 9.68467 29.8899 8.30871 29.8899 6.03969V6.02646C29.8899 3.77729 31.2363 2.38809 33.2691 2.38809C35.3085 2.38809 36.6616 3.76406 36.6616 6.02646V6.03969C36.6616 8.31532 35.3284 9.68467 33.2757 9.68467ZM33.2823 8.35502C34.3185 8.35502 34.9851 7.50827 34.9851 6.03969V6.02646C34.9851 4.5645 34.3119 3.72437 33.2691 3.72437C32.2461 3.72437 31.5663 4.57111 31.5663 6.02646V6.03969C31.5663 7.51488 32.2329 8.35502 33.2823 8.35502Z"
												fill="#AEAEAE"
											/>
											<path d="M27.1387 9.54576V0H28.7821V9.54576H27.1387Z" fill="#AEAEAE" />
											<path
												d="M22.4457 9.54633V2.53421H24.0891V3.74479H24.1221C24.3399 2.89804 24.9207 2.38867 25.7259 2.38867C25.9305 2.38867 26.1219 2.42175 26.2473 2.45482V3.94325C26.1087 3.89033 25.8579 3.85063 25.5807 3.85063C24.6501 3.85063 24.0891 4.43939 24.0891 5.47798V9.54633H22.4457Z"
												fill="#CCCCCC"
											/>
											<path
												d="M17.2788 9.68525C15.741 9.68525 14.8632 8.69297 14.8632 7.06563V2.53421H16.5066V6.74148C16.5066 7.73377 16.9686 8.29606 17.9058 8.29606C18.8496 8.29606 19.4502 7.61469 19.4502 6.59595V2.53421H21.0937V9.54633H19.4502V8.44821H19.4172C19.0542 9.19573 18.3348 9.68525 17.2788 9.68525Z"
												fill="#CCCCCC"
											/>
											<path
												d="M10.4535 9.68525C8.39428 9.68525 7.06767 8.30929 7.06767 6.04027V6.02704C7.06767 3.77787 8.41408 2.38867 10.4469 2.38867C12.4863 2.38867 13.8393 3.76464 13.8393 6.02704V6.04027C13.8393 8.3159 12.5061 9.68525 10.4535 9.68525ZM10.4601 8.3556C11.4963 8.3556 12.1629 7.50885 12.1629 6.04027V6.02704C12.1629 4.56508 11.4897 3.72495 10.4469 3.72495C9.42388 3.72495 8.74408 4.57169 8.74408 6.02704V6.04027C8.74408 7.51546 9.41068 8.3556 10.4601 8.3556Z"
												fill="#CCCCCC"
											/>
											<path
												d="M1.5246 11.8749C1.2078 11.8749 0.877802 11.8352 0.679802 11.8021V10.5452C0.805202 10.5717 0.996602 10.6048 1.2276 10.6048C1.8546 10.6048 2.20441 10.4262 2.41561 9.8374L2.51461 9.55295L0 2.53421H1.7952L3.43201 8.14391H3.47821L5.12161 2.53421H6.85082L4.33621 9.78448C3.80161 11.3258 2.98321 11.8749 1.5246 11.8749Z"
												fill="#CCCCCC"
											/>
										</svg>
									</div>
									<div className="grid h-[90px] w-[106px] place-items-center bg-white">
										<Text as="p" color="neutral-700" size={14}>
											Heading
										</Text>
									</div>
									<div className="grid h-[90px] w-[106px] place-items-center bg-white">
										<svg width="46" height="36" viewBox="0 0 46 36" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect
												x="0.5"
												y="0.5"
												width="44.9999"
												height="34.9996"
												rx="5.5"
												fill="#C2C2C2"
												fill-opacity="0.2"
												stroke="#CCCCCC"
											/>
											<path
												d="M6.95312 20.1377C8.56657 19.1617 10.5675 19.0811 12.2549 19.9229L41.1934 34.3584L40.9961 34.498C40.0696 35.1499 38.9639 35.5 37.8311 35.5H5.5C2.73865 35.5 0.500115 33.2613 0.5 30.5V24.041L6.95312 20.1377Z"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<path
												d="M28.3887 14.3477C30.0711 13.2574 32.2139 13.1692 33.9805 14.1172L45.501 20.2988V30C45.5008 33.0374 43.0384 35.4999 40.001 35.5H8.01855C5.34111 35.5 2.89684 34.0187 1.64941 31.6758L28.3887 14.3477Z"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<circle cx="13.5" cy="10.5" r="4" fill="#C2C2C2" fill-opacity="0.5" stroke="#CCCCCC" />
										</svg>
									</div>
									<div className="grid h-[90px] w-[106px] place-items-center bg-white">
										<svg width="112" height="96" viewBox="0 0 112 96" fill="none" xmlns="http://www.w3.org/2000/svg">
											<g filter="url(#filter0_d_25_6552)">
												<rect x="3" y="2" width="106" height="90" rx="14" fill="white" />
												<rect
													x="32.5"
													y="46.5"
													width="47"
													height="1"
													rx="0.5"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
											</g>
											<defs>
												<filter
													id="filter0_d_25_6552"
													x="0"
													y="0"
													width="112"
													height="96"
													filterUnits="userSpaceOnUse"
													color-interpolation-filters="sRGB"
												>
													<feFlood flood-opacity="0" result="BackgroundImageFix" />
													<feColorMatrix
														in="SourceAlpha"
														type="matrix"
														values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
														result="hardAlpha"
													/>
													<feOffset dy="1" />
													<feGaussianBlur stdDeviation="1.5" />
													<feComposite in2="hardAlpha" operator="out" />
													<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.23 0" />
													<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_25_6552" />
													<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_25_6552" result="shape" />
												</filter>
											</defs>
										</svg>
									</div>
									<div className="grid h-[90px] w-[106px] place-items-center bg-white">
										<div>
											{" "}
											<svg width="38" height="30" viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
												<rect
													x="0.5"
													y="0.5"
													width="36.9998"
													height="29"
													rx="5.5"
													fill="#C2C2C2"
													fill-opacity="0.2"
													stroke="#CCCCCC"
												/>
												<path
													d="M5.28125 17.1631C6.90322 16.1734 8.92089 16.0912 10.6182 16.9453L33.8584 28.6396C32.9778 29.1997 31.9547 29.5 30.9072 29.5H5.5C2.73858 29.5 0.500001 27.2614 0.5 24.5V20.0801L5.28125 17.1631Z"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
												<path
													d="M22.9629 12.376C24.6536 11.2707 26.8144 11.1811 28.5908 12.1426L37.499 16.9639V24C37.499 27.0376 35.0366 29.5 31.999 29.5H6.65234C4.4827 29.5 2.50069 28.3104 1.47363 26.4248L22.9629 12.376Z"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
												<circle cx="11.3496" cy="8.75" r="3.25" fill="#C2C2C2" fill-opacity="0.5" stroke="#CCCCCC" />
											</svg>
										</div>
										<div>
											<svg width="38" height="14" viewBox="0 0 38 14" fill="none" xmlns="http://www.w3.org/2000/svg">
												<rect
													x="0.5"
													y="6.5"
													width="29"
													height="1"
													rx="0.5"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
												<rect
													x="0.5"
													y="0.5"
													width="33"
													height="1"
													rx="0.5"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
												<rect
													x="0.5"
													y="12.5"
													width="37"
													height="1"
													rx="0.5"
													fill="#C2C2C2"
													fill-opacity="0.5"
													stroke="#CCCCCC"
												/>
											</svg>
										</div>
									</div>
									<div className="grid h-[90px] w-[106px] place-items-center bg-white">
										<svg width="48" height="42" viewBox="0 0 48 42" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect
												x="0.5"
												y="0.5"
												width="47"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="0.5"
												y="24.5"
												width="47"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="0.5"
												y="8.5"
												width="32"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="0.5"
												y="32.5"
												width="32"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="0.5"
												y="16.5"
												width="40"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
											<rect
												x="0.5"
												y="40.5"
												width="40"
												height="1"
												rx="0.5"
												fill="#C2C2C2"
												fill-opacity="0.5"
												stroke="#CCCCCC"
											/>
										</svg>
									</div>
								</div>
							</Tab>
							<Tab key="templates" title="Templates">
								<div></div>
							</Tab>
						</Tabs>
					</div>

					<div className="h-full! w-full! bg-[#BCD1D6] rounded-[30px]"></div>
				</DrawerBody>

				<DrawerFooter className="border-black/5 border-t pt-3.5 pb-39">
					<Button color="secondary" onPress={onClose}>
						Add to templates
					</Button>
					<div className="flex w-full justify-end gap-3.5">
						<Button color="secondary" onPress={onClose}>
							Save draft
						</Button>
						<Button onPress={onClose}>Preview and send</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

export default NewsletterDrawer
