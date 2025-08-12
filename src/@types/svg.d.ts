declare module '*.svg' {
  import * as React from 'react'
  // React component export (SVGR with exportAsDefault enabled)
  const ReactComponent: React.FC<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >
  export { ReactComponent }
  // Default export is also a React component because we configure exportAsDefault: true
  const defaultExport: React.FC<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >
  export default defaultExport
}
