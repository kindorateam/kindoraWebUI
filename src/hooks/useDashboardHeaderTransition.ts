import { useEffect, useRef, useState } from "react"

const TRANSITION_DISTANCE_PX = 96
const TRIGGER_ATTRIBUTE = "data-dashboard-header-trigger"

const useDashboardHeaderTransition = (enabled: boolean) => {
	const ref = useRef<HTMLElement>(null)
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		if (!enabled) {
			setProgress(0)
			return
		}

		const scrollContainer = ref.current?.parentElement
		const triggerElement = scrollContainer?.querySelector<HTMLElement>(`[${TRIGGER_ATTRIBUTE}]`)

		if (!scrollContainer || !triggerElement) {
			if (import.meta.env.DEV) {
				console.warn(
					`useDashboardHeaderTransition: missing scroll container or [${TRIGGER_ATTRIBUTE}] element — transition disabled`,
				)
			}
			return
		}

		const updateProgress = () => {
			const containerTop = scrollContainer.getBoundingClientRect().top
			const triggerTop = triggerElement.getBoundingClientRect().top - containerTop + scrollContainer.scrollTop
			const headerHeight = ref.current?.offsetHeight ?? 0
			const triggerStart = triggerTop - headerHeight
			const next = (scrollContainer.scrollTop - triggerStart) / TRANSITION_DISTANCE_PX

			setProgress(Math.min(Math.max(next, 0), 1))
		}

		updateProgress()
		scrollContainer.addEventListener("scroll", updateProgress, { passive: true })

		return () => scrollContainer.removeEventListener("scroll", updateProgress)
	}, [enabled])

	return { ref, progress }
}

export default useDashboardHeaderTransition
