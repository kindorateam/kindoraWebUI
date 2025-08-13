interface PlaceholderPageProps {
  name: string
}

const PlaceholderPage = ({ name }: PlaceholderPageProps) => (
  <div className="p-6">{name} Page (Coming Soon)</div>
)

export default PlaceholderPage
