import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import CustomRow from './CustomRow'

const getRandom = () => {
  const min = 1
  const max = 100
  const rand = min + Math.random() * (max - min)
  return rand.toString()
}

const CustomListview = ({ itemList }) => (
  <View style={styles.container}>
    <FlatList
      data={itemList}
      keyExtractor={item => item.datenv + item.horenv + getRandom()}
      renderItem={({ item }) => <CustomRow
        title={`${item.datenv} - ${item.horenv} - ${item.placa}`}
        description={item.txtmsg}
        icone='md-chatbubbles'
      />}
    />

  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 250,
  },
})

export default CustomListview