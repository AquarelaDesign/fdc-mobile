import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon } from 'native-base'

const CustomRow = ({ title, description, icone }) => (
  <View style={styles.container}>
    <Icon name={icone} style={styles.photo} />
    <View style={styles.container_text}>
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={styles.description}>
        {description}
      </Text>
    </View>

  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: '#FFF',
    elevation: 2,
  },

  title: {
    fontSize: 14,
    color: '#000',
    color: '#4169E1'
  },

  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },

  description: {
    fontSize: 11,
    fontStyle: 'italic',
  },

  photo: {
    height: 50,
    width: 50,
    color: '#4169E1'
  },

})

export default CustomRow