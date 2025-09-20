import Button from './Button'
import Chat from './Chat/Chat'
import Chip from './Chip'
import DetailCard from './DetailCard'
import InfoCard from './InfoCard'
import Text from './Text'

const StudentActivityTab = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-4">
        <InfoCard
          className="mb-4"
          footer={
            <Button className="w-full bg-black/5" color="secondary">
              New Message
            </Button>
          }
          title="Parent"
        >
          <DetailCard
            avatar={{
              name: 'John Doe',
              src: 'https://i.pravatar.cc/150?img=3',
            }}
            // className="mb-7"
            rows={[
              {
                label: 'Email',
                value: (
                  <Text as="span" color="brand" size={12} weight="regular">
                    j.hayes@example.com
                  </Text>
                ),
                href: 'mailto:j.hayes@example.com',
              },
              {
                label: 'Phone',
                value: (
                  <Text as="span" color="black" size={12} weight="regular">
                    (415) 555-1234
                  </Text>
                ),
                href: 'tel:+14155555678',
              },
              {
                label: 'Pin',
                value: (
                  <Chip className="bg-brand/20! text-[11px] font-semibold!">
                    <Text as="span" color="brand" size={11} weight="semibold">
                      4423
                    </Text>
                  </Chip>
                ),
              },
            ]}
            title="John Doe"
          />
          <DetailCard
            avatar={{
              name: 'John Doe',
              src: 'https://i.pravatar.cc/150?img=3',
            }}
            rows={[
              {
                label: 'Email',
                value: (
                  <Text as="span" color="brand" size={12} weight="regular">
                    j.hayes@example.com
                  </Text>
                ),
                href: 'mailto:j.hayes@example.com',
              },
              {
                label: 'Phone',
                value: (
                  <Text as="span" color="black" size={12} weight="regular">
                    (415) 555-1234
                  </Text>
                ),
                href: 'tel:+14155555678',
              },
              {
                label: 'Pin',
                value: (
                  <Chip className="bg-brand/20! text-[11px] font-semibold!">
                    <Text as="span" color="brand" size={11} weight="semibold">
                      4423
                    </Text>
                  </Chip>
                ),
              },
            ]}
            title="John Doe"
          />
        </InfoCard>
        <InfoCard className="mb-4" title="Guardians">
          <DetailCard
            avatar={{
              name: 'John Doe',
              src: 'https://i.pravatar.cc/150?img=3',
            }}
            rows={[
              {
                label: 'Phone',
                value: (
                  <Text as="span" color="black" size={12} weight="regular">
                    (415) 555-1234
                  </Text>
                ),
                href: 'tel:+14155555678',
              },
              {
                label: 'Pin',
                value: (
                  <Chip className="bg-brand/20! text-[11px] font-semibold!">
                    <Text as="span" color="brand" size={11} weight="semibold">
                      4423
                    </Text>
                  </Chip>
                ),
              },
            ]}
            title="John Doe"
          />
        </InfoCard>
        <InfoCard className="mb-4" title="Medical Info">
          <DetailCard
            rows={[
              {
                label: 'Allergies',
                value: (
                  <Text as="span" size={12} weight="regular">
                    Nuts, Fish
                  </Text>
                ),
              },
              {
                label: 'Doctor',
                value: (
                  <Text as="span" color="black" size={12} weight="semibold">
                    Alexander Johns
                  </Text>
                ),
              },
              {
                label: 'Phone',
                value: (
                  <Text as="span" color="black" size={12} weight="regular">
                    (415) 555-1234
                  </Text>
                ),
                href: 'tel:+14155555678',
              },
            ]}
          />
        </InfoCard>
      </div>
      <div className="col-span-8">
        <Chat />
      </div>
    </div>
  )
}

export default StudentActivityTab
