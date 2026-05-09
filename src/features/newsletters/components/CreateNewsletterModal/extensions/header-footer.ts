import { Node, mergeAttributes } from "@tiptap/core"

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		emailHeader: {
			insertEmailHeader: () => ReturnType
		}
		emailFooter: {
			insertEmailFooter: () => ReturnType
		}
	}
}

export const createHeaderExtension = (placeholderText: string) =>
	Node.create({
		name: "emailHeader",
		group: "block",
		content: "block+",
		defining: true,
		isolating: true,

		parseHTML() {
			return [{ tag: 'header[data-type="email-header"]' }]
		},

		renderHTML({ HTMLAttributes }) {
			return ["header", mergeAttributes(HTMLAttributes, { "data-type": "email-header" }), 0]
		},

		addCommands() {
			return {
				insertEmailHeader:
					() =>
					({ commands }) => {
						return commands.insertContent([
							{
								type: this.name,
								content: [{ type: "paragraph", content: [{ type: "text", text: placeholderText }] }],
							},
							{ type: "paragraph" },
						])
					},
			}
		},
	})

export const createFooterExtension = (placeholderText: string) =>
	Node.create({
		name: "emailFooter",
		group: "block",
		content: "block+",
		defining: true,
		isolating: true,

		parseHTML() {
			return [{ tag: 'footer[data-type="email-footer"]' }]
		},

		renderHTML({ HTMLAttributes }) {
			return ["footer", mergeAttributes(HTMLAttributes, { "data-type": "email-footer" }), 0]
		},

		addCommands() {
			return {
				insertEmailFooter:
					() =>
					({ commands }) => {
						return commands.insertContent([
							{
								type: this.name,
								content: [{ type: "paragraph", content: [{ type: "text", text: placeholderText }] }],
							},
							{ type: "paragraph" },
						])
					},
			}
		},
	})
