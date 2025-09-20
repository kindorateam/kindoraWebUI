import { Link } from '@heroui/react'

import Button from './Button'
import StaffCard from './StaffCard'
import Text from './Text'

const StaffProfileTab = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-9 space-y-7">
        <StaffCard
          footer={
            <div className="flex gap-2.5">
              <Button color="secondary">Deactivate account</Button>
              <Button color="secondary">Edit</Button>
            </div>
          }
          footerProps={{
            className: 'justify-end',
          }}
          title="Profile"
        >
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Name
            </Text>
            <Text color="black" size={14}>
              Mia
            </Text>
          </div>

          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Email
            </Text>
            <Link href="mailto:mia@example.com">
              <Text as="span" color="brand" size={14}>
                j.hayes@example.com
              </Text>
            </Link>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Phone
            </Text>
            <Link href="tel:+1234567890">
              <Text as="span" color="black" size={14}>
                (234) 567-890
              </Text>
            </Link>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              DOB
            </Text>
            <Text color="black" size={14}>
              Jun 16, 1988
            </Text>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Age
            </Text>
            <Text color="black" size={14}>
              35
            </Text>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Gender
            </Text>
            <Text color="black" size={14}>
              Female
            </Text>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Race
            </Text>
            <Text color="black" size={14}>
              White
            </Text>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Ethnicity
            </Text>
            <Text color="black" size={14}>
              Not Hispanic or Latino
            </Text>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Notes
            </Text>
            <Text color="black" size={14}>
              -
            </Text>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Enroll date
            </Text>
            <Text color="black" size={14}>
              08.15.2025
            </Text>
          </div>
        </StaffCard>
        <StaffCard
          footer={
            <div className="flex gap-2.5">
              <Button color="secondary">Edit</Button>
            </div>
          }
          footerProps={{
            className: 'justify-end',
          }}
          title="Address"
        >
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Address
            </Text>
            <Text color="black" size={14}>
              123 Main St, Springfield, USA
            </Text>
          </div>
        </StaffCard>
        <StaffCard
          footer={
            <div className="flex gap-2.5">
              <Button color="secondary">Edit</Button>
            </div>
          }
          footerProps={{
            className: 'justify-end',
          }}
          title="Medical Info"
        >
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Allergies
            </Text>
            <Text color="black" size={14}>
              Nutes, Fish
            </Text>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Medications
            </Text>
            <Text color="black" size={14}>
              -
            </Text>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Doctor
            </Text>
            <Text color="black" size={14}>
              Alexander Johns
            </Text>
          </div>

          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Phone
            </Text>
            <Link href="tel:+1234567890">
              <Text as="span" color="black" size={14}>
                (234) 567-890
              </Text>
            </Link>
          </div>
        </StaffCard>

        <StaffCard
          footer={
            <div className="flex gap-2.5">
              <Button color="secondary">Edit</Button>
            </div>
          }
          footerProps={{
            className: 'justify-end',
          }}
          title="Emergency contact"
        >
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Name
            </Text>
            <Text color="black" size={14}>
              Jason Statham
            </Text>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Phone
            </Text>
            <Link href="tel:+1234567890">
              <Text as="span" color="black" size={14}>
                (234) 567-890
              </Text>
            </Link>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Relationship to staff
            </Text>
            <Text color="black" size={14}>
              Dad
            </Text>
          </div>
        </StaffCard>
        <StaffCard
          footer={
            <div className="flex gap-2.5">
              <Button color="secondary">Edit</Button>
            </div>
          }
          footerProps={{
            className: 'justify-end',
          }}
          title="Certification"
        >
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Degree
            </Text>
            <Text color="black" size={14}>
              Ph.D. degree
            </Text>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              Certification
            </Text>
            <Text as="span" color="black" size={14}>
              0-00
            </Text>
          </div>
          <div className="flex items-center gap-20">
            <Text color="neutral-600" size={12}>
              ECE credits
            </Text>
            <Text color="black" size={14}>
              1000
            </Text>
          </div>
        </StaffCard>
      </div>
      <div className="col-span-3"></div>
    </div>
  )
}

export default StaffProfileTab
