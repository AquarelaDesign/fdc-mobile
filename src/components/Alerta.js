import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import AwesomeAlert from 'react-native-awesome-alerts'

function Alerta () {
   const [show, setShows] = useState([false])

   function showAlert() {
      setShows(true)
   }

   function hideAlert() {
      setShows(false)
   }

   return (
      <View style={styles.container}>
 
        <Text>I'm AwesomeAlert</Text>
        <TouchableOpacity onPress={() => {
          this.showAlert();
        }}>
          <View style={styles.button}>
            <Text style={styles.text}>Try me!</Text>
          </View>
        </TouchableOpacity>
 
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="AwesomeAlert"
          message="I have a message for you!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Não"
          confirmText="Sim"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      </View>

   )

}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: '#fff',
   },

   button: {
     margin: 10,
     paddingHorizontal: 10,
     paddingVertical: 7,
     borderRadius: 5,
     backgroundColor: "#AEDEF4",
   },

   text: {
     color: '#fff',
     fontSize: 15
   }
 })