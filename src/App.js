import React from 'react'
// import { Box, Heading } from '@looker/components'
import { AgGridTable } from './AgGridTable'
import { ExtensionProvider40 } from '@looker/extension-sdk-react'

export const App = () => {
  return (
    <ExtensionProvider40>
        <AgGridTable />
    </ExtensionProvider40>
  )
}