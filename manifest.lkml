
project_name: "looker-ag-grid-extension"

application: looker-ag-grid-extension {
  label: "looker-ag-grid-extension"
  url: "https://localhost:8080/bundle.js"
  # file: "bundle.js"
  entitlements: {
    core_api_methods: ["me", "run_inline_query"] #Add more entitlements here as you develop new functionality
  }
}
