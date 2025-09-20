import { Avatar } from '@heroui/react'

import Button from '../Button'
import Text from '../Text'

export interface ChatReply {
  id: string
  author: { name: string; avatarUrl?: string }
  timestamp: string
  text: string
  onReply?: (id: string) => void
}

export type ChatMessageProps = ChatReply & {
  replies?: ChatReply[]
}

const ChatMessage = ({
  id,
  author,
  timestamp,
  text,
  onReply,
  replies = [],
}: ChatMessageProps) => (
  <article className="flex gap-3">
    <Avatar
      className="shrink-0"
      name={author.name}
      size="sm"
      src={author.avatarUrl}
    />

    <div className="space-y-2.5">
      <header className="flex gap-2.5 pt-2">
        <Text size={12} weight="bold">
          {author.name}
        </Text>
        <Text color="neutral-500" size={12}>
          {timestamp}
        </Text>
      </header>

      <div>
        <Text as="p" size={14}>
          {text}
        </Text>
      </div>

      <div>
        <Button color="text" disableRipple onPress={() => onReply?.(id)}>
          Reply
        </Button>
      </div>

      <div className="mb-10">
        <Button
          color="text"
          disableRipple
          endContent={
            <svg
              fill="none"
              height="6"
              viewBox="0 0 8 6"
              width="8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L4 4L7 1"
                stroke="#792C41"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          onPress={() => onReply?.(id)}
        >
          See 5 more comments
        </Button>
      </div>

      {replies.length > 0 && (
        <ul>
          {replies.map((reply) => (
            <li className="flex gap-3" key={reply.id}>
              <ChatMessage {...reply} replies={[]} />
            </li>
          ))}
        </ul>
      )}
    </div>
  </article>
)

export default ChatMessage
