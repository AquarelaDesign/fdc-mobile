import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket',
  'Warning: componentWillReceiveProps',
  'Warning: DatePickerAndroid',
  "Warning: Can't perform a",
  "Possible Unhandled Promise Rejection",
])

export { default } from './src/routes'