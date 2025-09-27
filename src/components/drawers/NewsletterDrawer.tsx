import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Textarea,
} from '@heroui/react'
import { useCallback } from 'react'

import Button from '@/components/Button'
import Text from '@/components/Text'

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
      size="xl"
    >
      <DrawerContent>
        {() => (
          <div className="flex h-full flex-col px-12 py-10">
            <DrawerHeader className="flex flex-col gap-2 border-b border-black/5 pb-6">
              <Text as="h2" size={30} weight="bold">
                Create newsletter
              </Text>
              <Text color="neutral-500" size={14}>
                Draft your next update before sharing it with families.
              </Text>
            </DrawerHeader>

            <DrawerBody className="flex-1 overflow-y-auto py-6">
              <div className="flex flex-col gap-6">
                <Input
                  label="Title"
                  placeholder="Give your newsletter a name"
                />
                <Input
                  label="Subject line"
                  placeholder="Add a subject to preview in inboxes"
                />
                <Textarea
                  label="Content"
                  minRows={8}
                  placeholder="Share highlights, shoutouts, and upcoming events..."
                />
              </div>
            </DrawerBody>

            <DrawerFooter className="border-t border-black/5 pt-4">
              <div className="flex w-full justify-end gap-2">
                <Button color="secondary" onPress={onClose}>
                  Cancel
                </Button>
                <Button onPress={onClose}>Save draft</Button>
              </div>
            </DrawerFooter>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export default NewsletterDrawer
