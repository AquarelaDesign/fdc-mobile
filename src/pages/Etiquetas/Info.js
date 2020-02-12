import React, { useState, useEffect } from 'react'
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import GlobalStyles, {
  bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import MapView, { Marker } from 'react-native-maps'
const { width, height } = Dimensions.get('window')

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
      
      if (latitude === 0) {
        return
      }
        
      const lat = latitude.toString()
      if (lat.indexOf(".") === -1) {
        if (lat.indexOf("-") === -1) {
          div = (lat.length - 1) * 1000000
        } else {
          div = (lat.length) * 1000000
        }
        latitude /= div
      }
    } else {
      return
    }

    let longitude = dados.longit
    if (longitude !== undefined) {
      
      if (longitude === 0) {
        return
      }
        
      const lon = longitude.toString()
      if (lon.indexOf(".") === -1) {
        if (lon.indexOf("-") === -1) {
          div = (lon.length - 1) * 1000000
        } else {
          div = (lon.length) * 1000000
        }
        longitude /= div
      }
    } else {
      return
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
  
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
      >
        <View style={styles.container}>

          <View style={[styles.row, { marginTop: 15, }]}>
            <View style={styles.vlegend}>
              <Text style={styles.legend}>Serviço</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.vtext} >
              <Text style={styles.text}>{dados.descri}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '70%',}]}>
              <Text style={styles.legend}>Realizado em</Text>
            </View>
            <View style={[styles.vlegend, {width: '30%',}]}>
              <Text style={styles.legend}>KM</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vtext, {width: '70%',}]} >
              <Text style={styles.text}>{dados.dtrealfor}</Text>
            </View>
            <View style={[styles.vtext, {width: '30%',}]} >
              <Text style={styles.text}>{dados.kmreal}</Text>
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '70%',}]}>
              <Text style={styles.legend}>Próxima Revisão</Text>
            </View>
            <View style={[styles.vlegend, {width: '30%',}]}>
              <Text style={styles.legend}>KM</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vtext, {width: '70%',}]} >
              <Text style={styles.text}>{dados.dtproxfor}</Text>
            </View>
            <View style={[styles.vtext, {width: '30%',}]} >
              <Text style={styles.text}>{dados.kmprox}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.vlegend}>
              <Text style={styles.legend}>Local</Text>
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
      </LinearGradient>
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
    marginTop: 5,
    width: width,
  },

  legend: {
    fontSize: 12,
    color: '#4169E1',
    textAlign: 'left',
  },

  vtext: {
    width: width,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#F0E68C',
    textAlign: 'left',
  },

  map: {
    marginTop: 10,
    height: 200,
    marginVertical: 50,
  },

})
