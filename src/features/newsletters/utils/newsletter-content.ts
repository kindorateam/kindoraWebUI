const CONTENT_TAG_PATTERN = /<(img|hr|video|audio|iframe|table)\b/i

const stripHtml = (html: string) =>
	html
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/\s+/g, " ")
		.trim()

export const hasNewsletterContent = (html: string): boolean => {
	if (!html) return false

	const textContent = stripHtml(html)
	if (textContent.length > 0) return true

	return CONTENT_TAG_PATTERN.test(html)
}
