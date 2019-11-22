import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native'
import { WebView } from 'react-native-webview'

import GlobalStyles, { _url } from '../GlobalStyles'

export default function Browser({ navigation }) {
  const [uri, setUri] = useState(_url)

  useEffect(() => {
    setUri(navigation.getParam('uri'))
  },[uri])

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <WebView 
        source={{ uri: uri }} 
        style={{ marginTop: 40 }}
      />
    </SafeAreaView>
  )
}
