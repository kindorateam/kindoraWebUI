interface PlaceholderPageProps {
  name: string
}

export const PlaceholderPage = ({ name }: PlaceholderPageProps) => (
  <div className="p-6">{name} Page (Coming Soon)</div>
)
