---
name: i18n
description: Apply this repository's localization workflow whenever adding, editing, or removing text users can see, including labels, headings, buttons, placeholders, toasts, validation messages, errors, empty states, and accessibility text. Use for translation, locale, language-switching, or i18next work even when the user does not explicitly mention i18n.
---

# Internationalization

All user-visible application text goes through i18next. Locale files are TypeScript modules:

- `src/i18n/locales/en.ts` is the source language and defines the typed translation-key shape
- `src/i18n/locales/es.ts` is the Spanish translation and must mirror the English key structure
- `src/i18n/resources.ts` registers supported locales
- `src/i18n/useLanguage.ts` changes the active locale
- `src/i18n/locale.store.ts` persists the locale through Jotai `atomWithStorage`

## Adding Or Changing Text

1. Reuse an existing key when its meaning and context match
2. Add or update the English key under the appropriate feature or shared namespace
3. Make the corresponding Spanish change in the same edit
4. Consume the key with `useTranslation()` or pass a translation key through non-component configuration
5. Run the repository `verify` skill

```tsx
const { t } = useTranslation()

t("students.detail.notFound")
t("common.by", { name })
```

## Rules

- Translate labels, headings, buttons, placeholders, helper text, toasts, errors, empty states, table accessibility labels, and other user-facing accessibility text
- Do not use a translation key whose wording only happens to match but whose semantic context differs
- Keep keys grouped by feature or component and follow the existing local ordering
- Prefer interpolation and pluralization over string concatenation
- Keep API field names, logs intended only for developers, and protocol values untranslated
- Do not access `localStorage` directly; locale persistence belongs to the locale atom
- Preserve `@/*` imports and typed key usage

## Type-Safety Limit

The i18next augmentation in `src/i18n/types.ts` derives valid consumed keys from English. It catches invalid `t(...)` keys, but the current TypeScript setup does not prove that Spanish contains every English key. Compare both locale structures explicitly whenever translations change; do not claim that typecheck alone guarantees parity.
