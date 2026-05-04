import DOMPurify from "dompurify"

const ALLOWED_TAGS = [
	"a",
	"blockquote",
	"br",
	"div",
	"em",
	"footer",
	"h1",
	"h2",
	"h3",
	"h4",
	"header",
	"hr",
	"img",
	"input",
	"label",
	"li",
	"ol",
	"p",
	"s",
	"span",
	"strong",
	"u",
	"ul",
] as const

const ALLOWED_ATTRIBUTES = [
	"alt",
	"checked",
	"data-align",
	"data-size-mode",
	"data-type",
	"disabled",
	"height",
	"href",
	"src",
	"style",
	"title",
	"type",
	"width",
] as const

const REMOVED_WITH_CONTENT_TAGS = ["iframe", "object", "script", "style"] as const
const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"])
const SAFE_IMAGE_PROTOCOLS = new Set(["http:", "https:"])
const SAFE_TEXT_ALIGNMENTS = new Set(["left", "center", "right"])

const getMediaOrigins = () => {
	const origins = new Set<string>()
	const baseUrl = typeof window === "undefined" ? "https://localhost" : window.location.origin

	if (typeof window !== "undefined") {
		origins.add(window.location.origin)
	}

	const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL
	if (mediaBaseUrl) {
		try {
			origins.add(new URL(mediaBaseUrl, baseUrl).origin)
		} catch {
			// Ignore invalid environment configuration and fall back to same-origin media.
		}
	}

	return origins
}

const hasControlCharacters = (value: string) =>
	Array.from(value).some((character) => {
		const code = character.charCodeAt(0)
		return code <= 31 || code === 127
	})

export const isSafeNewsletterLinkUrl = (value: string) => {
	const url = value.trim()
	if (!url || hasControlCharacters(url)) return false
	if (url.startsWith("#")) return true

	try {
		const parsedUrl = new URL(url, typeof window === "undefined" ? "https://localhost" : window.location.origin)
		if (url.startsWith("/") && !url.startsWith("//")) return true
		return SAFE_LINK_PROTOCOLS.has(parsedUrl.protocol)
	} catch {
		return false
	}
}

export const isSafeNewsletterImageUrl = (value: string) => {
	const url = value.trim()
	if (!url || hasControlCharacters(url)) return false
	if (url.startsWith("/") && !url.startsWith("//")) return true

	try {
		const parsedUrl = new URL(url, typeof window === "undefined" ? "https://localhost" : window.location.origin)
		if (!SAFE_IMAGE_PROTOCOLS.has(parsedUrl.protocol)) return false
		return getMediaOrigins().has(parsedUrl.origin)
	} catch {
		return false
	}
}

const sanitizeStyle = (style: string) => {
	const safeDeclarations = style
		.split(";")
		.map((declaration) => declaration.trim())
		.filter((declaration) => {
			const [property, value] = declaration.split(":").map((part) => part.trim().toLowerCase())
			if (!value) return false
			return property === "text-align" && SAFE_TEXT_ALIGNMENTS.has(value)
		})

	return safeDeclarations.join("; ")
}

const applyNewsletterAttributePolicy = (element: Element) => {
	const tagName = element.tagName.toLowerCase()

	for (const attribute of Array.from(element.attributes)) {
		const name = attribute.name.toLowerCase()
		const value = attribute.value
		let keepAttribute = false
		let nextValue = value

		if (name === "style") {
			nextValue = sanitizeStyle(value)
			keepAttribute = nextValue.length > 0
		} else if (tagName === "a" && name === "href") {
			keepAttribute = isSafeNewsletterLinkUrl(value)
		} else if (tagName === "img" && name === "src") {
			keepAttribute = isSafeNewsletterImageUrl(value)
		} else if (tagName === "img" && ["alt", "height", "title", "width"].includes(name)) {
			keepAttribute = true
		} else if (tagName === "img" && name === "data-align") {
			keepAttribute = SAFE_TEXT_ALIGNMENTS.has(value)
		} else if (tagName === "img" && name === "data-size-mode") {
			keepAttribute = ["aspect-ratio", "height", "width"].includes(value)
		} else if (
			(tagName === "header" || tagName === "footer" || tagName === "ul" || tagName === "li") &&
			name === "data-type"
		) {
			keepAttribute = ["email-header", "email-footer", "taskList", "taskItem"].includes(value)
		} else if (tagName === "input" && name === "type") {
			nextValue = "checkbox"
			keepAttribute = value === "checkbox"
		} else if (tagName === "input" && ["checked", "disabled"].includes(name)) {
			keepAttribute = true
		}

		if (keepAttribute) {
			element.setAttribute(name, nextValue)
		} else {
			element.removeAttribute(attribute.name)
		}
	}

	if (tagName === "a") {
		element.setAttribute("rel", "noopener noreferrer")
	}

	if (tagName === "input") {
		element.setAttribute("disabled", "")
	}
}

export const sanitizeNewsletterHtml = (html: string) => {
	if (typeof window === "undefined") return html

	const template = document.createElement("template")
	template.innerHTML = DOMPurify.sanitize(html, {
		ALLOWED_ATTR: [...ALLOWED_ATTRIBUTES],
		ALLOWED_TAGS: [...ALLOWED_TAGS],
		FORBID_TAGS: [...REMOVED_WITH_CONTENT_TAGS],
	}) as string

	for (const element of Array.from(template.content.querySelectorAll("*"))) {
		applyNewsletterAttributePolicy(element)
		if (element.tagName.toLowerCase() === "input" && element.getAttribute("type") !== "checkbox") {
			element.remove()
		}
	}

	return template.innerHTML
}
