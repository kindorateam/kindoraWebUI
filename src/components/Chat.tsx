import { Avatar, Image, Input } from '@heroui/react'

import Button from './Button'
import Text from './Text'

const Chat = () => {
  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <Text as="h2" size={30} weight="bold">
          Today
        </Text>
        <Button color="secondary">Add activity</Button>
      </div>
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
            <div className="mb-5">
              <Text color="neutral-500" size={12}>
                You, Oleg, Igor, Serg
              </Text>
            </div>
            <div className="mb-5">
              <Input placeholder="Add a comment" />
            </div>
            <div className="flex gap-2.5">
              <div>
                <Avatar
                  name="Oleg"
                  size="sm"
                  src="https://i.pravatar.cc/150?img=5"
                />
              </div>
              <div>
                <div className="mb-2.5 flex gap-2.5 pt-2.5">
                  <Text size={12} weight="bold">
                    Oleh Mendoza
                  </Text>
                  <Text color="neutral-500" size={12}>
                    10:40 AM
                  </Text>
                </div>

                <div>
                  <Text as="p" className="mb-2.5" size={14}>
                    So glad to see Olivia had her lunch today. Thank you for
                    taking such good care of her - it’s comforting to know she’s
                    eating well and feeling safe at daycare.
                  </Text>
                  <Text as="p" color="brand" size={12} weight="semibold">
                    Reply
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
