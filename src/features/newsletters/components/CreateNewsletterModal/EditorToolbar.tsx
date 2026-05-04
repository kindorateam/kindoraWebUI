import { Separator, Toolbar } from "@heroui/react"

import TablerArrowBackUp from "~icons/tabler/arrow-back-up"
import TablerArrowForwardUp from "~icons/tabler/arrow-forward-up"
import TablerBlockquote from "~icons/tabler/blockquote"
import TablerClearFormatting from "~icons/tabler/clear-formatting"
import TablerLayoutNavbar from "~icons/tabler/layout-navbar"
import TablerLayoutNavbarExpand from "~icons/tabler/layout-navbar-expand"
import TablerLine from "~icons/tabler/line"

import ImageToolbarControls from "./ImageToolbarControls"
import LinkPopover from "./LinkPopover"
import ListTypeSelect from "./ListTypeSelect"
import TextAlignmentControls from "./TextAlignmentControls"
import TextFormattingControls from "./TextFormattingControls"
import TextStyleSelect from "./TextStyleSelect"
import ToolbarIconButton from "./ToolbarIconButton"
import ToolbarToggleButton from "./ToolbarToggleButton"

import type { Editor } from "@tiptap/react"

interface EditorToolbarProps {
	editor: Editor
	editorStateVersion: number
}

const ToolbarDivider = () => <Separator className="mx-1 h-8" />

const EditorToolbar = ({ editor, editorStateVersion }: EditorToolbarProps) => (
	<Toolbar
		aria-label="Newsletter editor toolbar"
		className="flex flex-wrap items-center gap-1 border-default-200 border-b p-2"
		data-editor-state-version={editorStateVersion}
	>
		<ToolbarIconButton
			icon={<TablerArrowBackUp className="size-4" />}
			isDisabled={!editor.can().undo()}
			onPress={() => editor.chain().focus().undo().run()}
			tooltip="Undo"
		/>
		<ToolbarIconButton
			icon={<TablerArrowForwardUp className="size-4" />}
			isDisabled={!editor.can().redo()}
			onPress={() => editor.chain().focus().redo().run()}
			tooltip="Redo"
		/>

		<ToolbarDivider />

		<TextStyleSelect editor={editor} />

		<ToolbarDivider />

		<TextFormattingControls editor={editor} />

		<ToolbarDivider />

		<TextAlignmentControls editor={editor} />

		<ToolbarDivider />

		<ListTypeSelect editor={editor} />

		<ToolbarDivider />

		<ToolbarToggleButton
			icon={<TablerBlockquote className="size-4" />}
			id="blockquote"
			isSelected={editor.isActive("blockquote")}
			onPress={() => editor.chain().focus().toggleBlockquote().run()}
			tooltip="Quote"
		/>
		<ToolbarIconButton
			icon={<TablerLine className="size-4" />}
			onPress={() => editor.chain().focus().setHorizontalRule().run()}
			tooltip="Divider"
		/>

		<ToolbarDivider />

		<LinkPopover editor={editor} />
		<ImageToolbarControls editor={editor} />

		<ToolbarDivider />

		<ToolbarIconButton
			icon={<TablerLayoutNavbar className="size-4" />}
			onPress={() => editor.chain().focus().insertEmailHeader().run()}
			tooltip="Insert header"
		/>
		<ToolbarIconButton
			icon={<TablerLayoutNavbarExpand className="size-4" />}
			onPress={() => editor.chain().focus().insertEmailFooter().run()}
			tooltip="Insert footer"
		/>

		<ToolbarDivider />

		<ToolbarIconButton
			icon={<TablerClearFormatting className="size-4" />}
			onPress={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
			tooltip="Clear formatting"
		/>
	</Toolbar>
)

export default EditorToolbar
