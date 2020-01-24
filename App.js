import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket',
  'Error: timeout of',
  "Warning: Can't perform a",
  "Possible Unhandled Promise Rejection",
])

export { default } from './src/routes'