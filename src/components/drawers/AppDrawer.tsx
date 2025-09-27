import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Tab,
  Tabs,
} from '@heroui/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'

import Button from '@/components/Button'
import Text from '@/components/Text'
import {
  closeDrawerAtom,
  drawerIsOpenAtom,
  drawerOptionsAtom,
  resetDrawerAtom,
} from '@/stores/drawer.store'

const DRAWER_CLOSE_DELAY = 200

const ADD_ACTIVITY_TABS = [
  { key: 'photo', label: 'Photo', icon: '📷' },
  { key: 'video', label: 'Video', icon: '🎬' },
  { key: 'food', label: 'Food', icon: '🍽️' },
  { key: 'bathroom', label: 'Bathroom', icon: '🚿' },
  { key: 'nap', label: 'Nap', icon: '😴' },
  { key: 'meds', label: 'Meds', icon: '💊' },
  { key: 'learning', label: 'Learning', icon: '📚' },
  { key: 'note', label: 'Note', icon: '📝' },
  { key: 'mood', label: 'Mood', icon: '😊' },
  { key: 'incident', label: 'Incident', icon: '⚠️' },
  { key: 'name-to-face', label: 'Name to face', icon: '🧠' },
] as const

type AddActivityTabKey = (typeof ADD_ACTIVITY_TABS)[number]['key']

const DEFAULT_TAB: AddActivityTabKey = ADD_ACTIVITY_TABS[0].key

const resolveTabKey = (key?: string | null): AddActivityTabKey => {
  if (!key) {
    return DEFAULT_TAB
  }

  return (
    ADD_ACTIVITY_TABS.some((tab) => tab.key === key) ? key : DEFAULT_TAB
  ) as AddActivityTabKey
}

const AppDrawer = () => {
  const isOpen = useAtomValue(drawerIsOpenAtom)
  const options = useAtomValue(drawerOptionsAtom)
  const closeDrawer = useSetAtom(closeDrawerAtom)
  const resetDrawer = useSetAtom(resetDrawerAtom)

  const [activeTab, setActiveTab] = useState<AddActivityTabKey>(DEFAULT_TAB)

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeDrawer()
      }
    },
    [closeDrawer],
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setActiveTab(resolveTabKey(options?.initialTabKey ?? null))
  }, [isOpen, options?.initialTabKey])

  useEffect(() => {
    if (isOpen || !options || typeof window === 'undefined') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      resetDrawer()
      setActiveTab(DEFAULT_TAB)
    }, DRAWER_CLOSE_DELAY)

    return () => window.clearTimeout(timeoutId)
  }, [isOpen, options, resetDrawer, setActiveTab])

  if (!options && !isOpen) {
    return null
  }

  const title = options?.title ?? 'Add activity'
  const activeTabConfig =
    ADD_ACTIVITY_TABS.find((tab) => tab.key === activeTab) ??
    ADD_ACTIVITY_TABS[0]

  return (
    <Drawer
      backdrop="blur"
      hideCloseButton
      isDismissable
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      placement={options?.placement ?? 'right'}
      size="5xl"
    >
      <DrawerContent>
        {() => (
          <div className="flex h-full flex-col px-25 pt-10">
            <DrawerHeader className="border-b border-black/5 pb-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <Text as="h2" size={30} weight="bold">
                    {title}
                  </Text>
                </div>
                <Tabs
                  aria-label="Activity type"
                  classNames={{
                    base: 'w-full',
                    tabList:
                      'flex gap-4 border-b border-black/10 bg-transparent px-0 pb-0',
                    tab: 'h-[60px] px-0 py-0 data-[selected=true]:after:bg-brand',
                    tabContent:
                      'flex flex-col items-center gap-1 text-[13px] text-neutral-500 data-[selected=true]:text-brand data-[selected=true]:font-semibold',
                    cursor: 'hidden',
                  }}
                  onSelectionChange={(key) =>
                    setActiveTab(
                      resolveTabKey(
                        typeof key === 'string' ? key : String(key),
                      ),
                    )
                  }
                  selectedKey={activeTab}
                  variant="underlined"
                >
                  {ADD_ACTIVITY_TABS.map((tab) => (
                    <Tab
                      key={tab.key}
                      title={
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl leading-none">
                            {tab.icon}
                          </span>
                          <span>{tab.label}</span>
                        </div>
                      }
                    />
                  ))}
                </Tabs>
              </div>
            </DrawerHeader>

            <DrawerBody className="flex-1 overflow-y-auto py-6">
              <div className="flex flex-col gap-3">
                <Text as="h3" size={18} weight="semibold">
                  {activeTabConfig.label}
                </Text>
                <Text color="neutral-600" size={14}>
                  Mock inputs for the{' '}
                  <Text as="span" weight="semibold">
                    {activeTabConfig.label}
                  </Text>{' '}
                  tab will live here. Use this space to outline fields, upload
                  areas, and any helper text teams might need.
                </Text>
                <Text color="neutral-600" size={14}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  sit amet sem et lectus luctus vulputate. Pellentesque habitant
                  morbi tristique senectus et netus et malesuada fames ac turpis
                  egestas.
                </Text>
              </div>
            </DrawerBody>

            <DrawerFooter className="border-t border-black/5 pt-4">
              <div className="flex w-full justify-end gap-2">
                <Button color="secondary" onPress={closeDrawer}>
                  Cancel
                </Button>
                <Button onPress={closeDrawer}>Add activity</Button>
              </div>
            </DrawerFooter>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export default AppDrawer
