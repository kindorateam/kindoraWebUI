import { Button, Dropdown, Label } from "@heroui/react"
import { useTranslation } from "react-i18next"

import { useLanguage } from "@/i18n/useLanguage"
import MaterialSymbolsTranslate from "~icons/material-symbols/translate"

const LanguageSwitcher = () => {
	const { t } = useTranslation()
	const { changeLanguage, languageOptions, locale } = useLanguage()
	const currentLanguage = languageOptions.find((language) => language.locale === locale)

	return (
		<Dropdown>
			<Dropdown.Trigger>
				<Button className="bg-white shadow-md" variant="ghost">
					<MaterialSymbolsTranslate className="size-4" />
					{currentLanguage?.shortLabel ?? locale.toUpperCase()}
				</Button>
			</Dropdown.Trigger>
			<Dropdown.Popover>
				<Dropdown.Menu aria-label={t("language.switcherAria")}>
					{languageOptions.map((language) => (
						<Dropdown.Item
							id={language.locale}
							key={language.locale}
							onPress={() => changeLanguage(language.locale)}
							textValue={t(language.labelKey)}
						>
							<Label className={language.locale === locale ? "font-semibold text-accent" : undefined}>
								{t(language.labelKey)}
							</Label>
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown.Popover>
		</Dropdown>
	)
}

export default LanguageSwitcher
