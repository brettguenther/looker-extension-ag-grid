import React from 'react'
// import { createRoot } from 'react-dom/client'
import * as ReactDOM from 'react-dom'
import { ExtensionProvider40 } from '@looker/extension-sdk-react'
import { ComponentsProvider, GlobalStyle } from '@looker/components'
import { App } from './App'

window.addEventListener('DOMContentLoaded', () => {
  // const container = document.getElementById('root')
  // if (container) {
  //   const root = createRoot(container)
  //   root.render(
  //     <ExtensionProvider40>
  //       <ComponentsProvider>
  //         <GlobalStyle />
  //         <App />
  //       </ComponentsProvider>
  //     </ExtensionProvider40>
  //   )
  // }
    var root = document.createElement('div')
  document.body.appendChild(root)
  ReactDOM.render(<App />, root)
})
