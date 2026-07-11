---
name: heroui-v3
description: Apply the installed HeroUI v3 patterns whenever creating or modifying UI with @heroui/react components, including buttons, dropdowns, modals, tables, forms, popovers, tabs, and accessibility behavior. Use this for hydration errors, nested-button warnings, styling problems, or unfamiliar HeroUI APIs; do not rely on HeroUI v2 memory.
---

# HeroUI v3

The project currently pins HeroUI 3.2.2 and uses its compound-component API on top of React Aria. Check `package.json` before assuming a version and inspect nearby working components. Use the independently installed official `heroui-react` skill to fetch component documentation, source, styles, themes, or guides. Use the `heroui-react` MCP server as a supplementary source for unfamiliar APIs:

1. Call `get_component_docs` for the component's documented API and examples
2. Use `get_component_source_code` or `get_component_source_styles` only when debugging internals

Cross-check recent version changes against official release notes when fetched tooling reports older metadata.

HeroUI v2 examples and training-data memory are not compatible by default.

## Composition

- Prefer compound parts such as `Card.Header`, `Dropdown.Menu`, and `Table.Column`
- Use HeroUI directly unless a wrapper adds meaningful shared behavior
- Use Tailwind CSS 4 for layout and spacing around components; let Biome sort classes
- Import icons through `~icons/`; do not add inline SVGs or another icon package
- Preserve accessible names, focus behavior, keyboard operation, loading states, and disabled states

## Interaction Props

- On HeroUI and React Aria components, prefer semantic props such as `onPress` and `isDisabled`
- Native DOM elements may use native props such as `onClick` and `disabled`
- Check the component's v3 API rather than mechanically renaming props

## Dropdown Trigger Trap

`Dropdown.Trigger` renders a button. Nesting a HeroUI `Button` inside it creates invalid `<button><button>` markup and can cause hydration errors.

```tsx
// Wrong: nested buttons
<Dropdown>
	<Dropdown.Trigger>
		<Button>Open</Button>
	</Dropdown.Trigger>
</Dropdown>

// Correct: HeroUI applies the trigger behavior to the direct Button child
<Dropdown>
	<Button>Open</Button>
	<Dropdown.Popover>
		<Dropdown.Menu>{/* items */}</Dropdown.Menu>
	</Dropdown.Popover>
</Dropdown>
```

Use `Dropdown.Trigger` only when the trigger content is not already a button.

## Toggle Composition

HeroUI 3.2 uses explicit content composition for `Checkbox`, `Radio`, and `Switch`.

- Put `*.Control` inside `*.Content`
- Put label text directly inside `*.Content`; do not nest a `Label`
- Keep `Description` and `FieldError` as siblings of `*.Content`
- Control-only table selections still require `*.Content` around `*.Control` and an accessible label on the root

## Finish

Run the repository `verify` skill after changing HeroUI markup. For hydration or interaction defects, test the affected UI in a browser when that capability is available.
