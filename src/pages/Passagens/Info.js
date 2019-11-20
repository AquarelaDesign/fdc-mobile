import React, { useState, useEffect } from 'react'
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
const { width, height } = Dimensions.get('window')

import GlobalStyles from '../../GlobalStyles'

import bg from '../../assets/fundo-app.png'

export default function Info({ navigation }) {
  const [dados, setDados] = useState('')
  
  const [mker, setMarker] = useState({
    coordinate: {
      latitude: -25.455425, 
      longitude: -49.260244,
    },
    title: "Procyon Assessoria e Sistemas",
    description: "Ficha do Carro",
  })

  const [region, setRegion] = useState({
    latitude: -25.455425,
    longitude: -49.260244,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.048244186046511636,
  })
 
  useEffect(() => {
    setDados(navigation.getParam('dados'))

    let div = 0

    let latitude = dados.latit
    if (latitude !== undefined) {
      
      const lat = latitude.toString()
      if (lat.indexOf(".") === -1) {
        if (lat.indexOf("-") === -1) {
          div = (lat.length - 1) * 1000000
        } else {
          div = (lat.length) * 1000000
        }
        latitude /= div
      }
    }

    let longitude = dados.longit
    if (longitude !== undefined) {
      
      const lon = longitude.toString()
      if (lon.indexOf(".") === -1) {
        if (lon.indexOf("-") === -1) {
          div = (lon.length - 1) * 1000000
        } else {
          div = (lon.length) * 1000000
        }
        longitude /= div
      }
    }
    
    setRegion({
      latitude: latitude === undefined ? -25.455425 : latitude,
      longitude: longitude === undefined ? -49.260244 : longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922 * (width / height),
    })

    setMarker({
      coordinate: {
        latitude: latitude === undefined ? -25.455425 : latitude,
        longitude: longitude === undefined ? -49.260244 : longitude,
      },
      title: dados.nome === undefined ? "Procyon Assessoria e Sistemas" : dados.nome,
      description: "Ficha do Carro",
    })
  
  }, [dados])
  
  // console.log('dados', dados)
  // console.log('region', region)

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.vlegend}>
              <Text style={styles.legend}>Nome</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.vtext} >
              <Text style={styles.text}>{dados.nome}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.vlegend}>
              <Text style={styles.legend}>Endereço</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.vtext} >
              <Text style={styles.text}>{`${dados.endere}, ${dados.endnum}`}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '70%',}]}>
              <Text style={styles.legend}>Bairro</Text>
            </View>
            <View style={[styles.vlegend, {width: '30%',}]}>
              <Text style={styles.legend}>UF</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vtext, {width: '70%',}]} >
              <Text style={styles.text}>{dados.bairro}</Text>
            </View>
            <View style={[styles.vtext, {width: '30%',}]} >
              <Text style={styles.text}>{dados.uf}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.vlegend}>
              <Text style={styles.legend}>Fone</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.vtext} >
              <Text style={styles.text}>{dados.fone}</Text>
            </View>
          </View>

          <MapView
            style={styles.map}
            initialRegion={region}
            region={region}
          >
            <Marker
              coordinate={mker.coordinate}
              title={mker.title}
              description={mker.description}
            />
          </MapView>

        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: 20,
    width: width,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  vlegend: {
    marginTop: 10,
    width: width,
  },

  legend: {
    fontSize: 14,
    color: '#00FFFF',
    textAlign: 'left',
    // height: 20,
  },

  vtext: {
    marginTop: 5,
    width: width,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#F0E68C',
    textAlign: 'left',
    // width: '100%',
    // height: 20,
  },

  map: {
    marginTop: 10,
    height: 300,
    marginVertical: 50,
  },

})
