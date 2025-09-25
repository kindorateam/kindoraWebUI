import { Avatar, Image, Input } from '@heroui/react'
import { useCallback } from 'react'

import ChatMessage from './ChatMessage'
import EmojiGroup from './EmojiGroup'
import SocialMetrics from './SocialMetrics'
import Button from '@/components/Button'
import FilterIcon from '@/components/icons/FilterIcon'
import Text from '@/components/Text'
import useAppDrawer from '@/hooks/useAppDrawer'

const Chat = () => {
  const { openDrawer } = useAppDrawer()

  const handleAddActivity = useCallback(() => {
    openDrawer({
      initialTabKey: 'photo',
      size: 'lg',
      title: 'Add activity',
    })
  }, [openDrawer])

  return (
    <div>
      <div className="flex items-center justify-between">
        <Text as="h2" size={30} weight="bold">
          Today
        </Text>
        <div className="flex items-center gap-3.5">
          <Button
            className="min-w-auto!"
            color="secondary"
            startContent={<FilterIcon />}
          />
          <Button color="secondary" onPress={handleAddActivity}>
            Add activity
          </Button>
        </div>
      </div>
      <hr className="my-7 h-0.5 border-0 bg-black/5" />
      <div>
        <div className="grid grid-cols-[max-content_1fr] gap-3.5">
          <div>
            <Avatar name="John Doe" src="https://i.pravatar.cc/150?img=3" />
          </div>

          <div>
            <div className="mb-2.5 flex items-center justify-between pt-1.5">
              <Text size={18} weight="bold">
                Food
              </Text>
              <Text color="neutral-500" size={12} weight="regular">
                10:30 AM
              </Text>
            </div>
            <div className="mb-2.5 flex items-center justify-between">
              <Text color="neutral-500" size={14}>
                Lunch
              </Text>
              <Text color="brand" size={12}>
                Edit
              </Text>
            </div>
            <div className="mb-5">
              <Text as="p" color="neutral-800" size={14}>
                Hi! Just wanted to let you know that Olivia had a great feeding
                time today. She drank all of her milk from the bottle without
                any fuss and seemed really content afterward. She was calm and
                happy during the feeding, and even gave us a few sweet smiles.
              </Text>
            </div>
            <div className="mb-4">
              <Image
                alt="Olivia feeding"
                src="https://i.pravatar.cc/150?img=3"
                width="100%"
              />
            </div>
            <div className="mb-5 flex items-center gap-2">
              <EmojiGroup />
              <Text color="neutral-500" size={12}>
                You, Oleg, Igor, Serg
              </Text>
            </div>
            <div className="mb-2.5">
              <SocialMetrics />
            </div>
            <div className="mb-5">
              <Input
                classNames={{
                  inputWrapper:
                    'bg-transparent border-1 border-black/10 rounded-[14px] shadow-none',
                }}
                placeholder="Add a comment"
              />
            </div>
            <ChatMessage
              author={{
                name: 'Emily Hayes',
                avatarUrl: 'https://i.pravatar.cc/150?img=42',
              }}
              id="parent-1"
              onReply={(messageId) => console.log('reply to', messageId)}
              replies={[
                {
                  id: 'reply-1',
                  author: {
                    name: 'James Hayes',
                    avatarUrl: 'https://i.pravatar.cc/150?img=48',
                  },
                  timestamp: '11:40 AM',
                  text: "Absolutely agree. It's a great feeling knowing she's in good hands.",
                  onReply: (messageId) => console.log('reply to', messageId),
                },
                {
                  id: 'reply-2',
                  author: {
                    name: 'Taylor West',
                    avatarUrl: 'https://i.pravatar.cc/150?img=32',
                  },
                  timestamp: '11:45 AM',
                  text: 'Thanks for sharing the update!',
                  onReply: (messageId) => console.log('reply to', messageId),
                },
              ]}
              text="So glad to see Olivia had her lunch today..."
              timestamp="10:40 AM"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
