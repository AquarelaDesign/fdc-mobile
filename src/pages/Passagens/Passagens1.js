import React, { useState, useEffect } from 'react'

import {
  Alert,
  AsyncStorage,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native'

import { TabView, SceneMap } from 'react-native-tab-view'

import GlobalStyles from '../../GlobalStyles'
import Api from '../../services/api'

import logo from '../../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../../assets/fundo-app.png'

const colors = ['#00BFFF', '#1E90FF'];

export default function Passagens({ navigation }) {
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [placa, setPlaca] = useState('')
  const [oficina, setOficina] = useState({})
  const [pass, setPass] = useState([])

  const [state, setState] = useState({
    index: 0,
    routes: [
      { key: 'relatos', title: 'Relatos' },
      { key: 'servicos', title: 'Serviços' },
      { key: 'pecas', title: 'Peças' },
    ],
  })

  useEffect(() => {
    setPlaca(navigation.getParam('placa'))

    async function montaLista(placas) {
      let pas = []
      placas.map((item, i) => {
        pas.push({
          id: i,
          title: item.placa,
        })

      })
      setPass(pas)
    }

    AsyncStorage.getItem('token').then(Token => {
      if (Token) {
        setToken(Token)
      }
    })

    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      
      async function buscaPas() {
        try {
          const headers = {
            'Authorization': token
          }
          
          await Api.post('/v01/busca', {
            pservico: 'wfcpas',
            pmetodo: 'listaPassagens',
            pcodprg: '',
            pemail: email,
            params: {
              pplaca: placa,
            }
          },{
            headers: headers
          }).then(response => {
            if (response.status === 200) {
              // console.log('data', response.data.data)
              const { ttfccpvl } = response.data.data
              setPass(ttfccpvl)
            } 
          })
        } catch (error) {
          const { response } = error
          if (response !== undefined) {
            console.log(response.data.errors[0])
          } else {
            console.log(error)
          }
        }
      }
      buscaPas()
      
    })
  }, [email, token, oficina])
  
  // console.log('placa', placa)
  // console.log('oficina', oficina)

  const Relatos = () => (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <View style={[styles.listItem, { backgroundColor: '#4169E1' }]}>
          <Text style={[styles.listText, { width: '35%' }]}>Data</Text> 
          <Text style={[styles.listText, { width: '20%' }]}>KM</Text> 
          <Text style={[styles.listText, { width: '15%' }]}>R</Text> 
          <Text style={[styles.listText, { width: '15%' }]}>S</Text> 
          <Text style={[styles.listText, { width: '15%' }]}>P</Text> 
        </View>
        
        <FlatList 
          style={styles.list}
          data={pass}
          keyExtractor={pass => pass.idgpas.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
              <Text style={[styles.listText, { width: '35%' }]}>{item.dtpsgfor}</Text> 
              <Text style={[styles.listText, { width: '20%' }]}>{item.kilome}</Text> 
              <Text style={[styles.listText, { width: '15%' }]}>{item.totrel}</Text> 
              <Text style={[styles.listText, { width: '15%' }]}>{item.totser}</Text> 
              <Text style={[styles.listText, { width: '15%' }]}>{item.totpec}</Text> 
            </View>
          )}
        />

      </ImageBackground>
    </View>
  )

  const Servicos = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]}>
      <Text>Serviços</Text>
    </View>
  )

  const Pecas = () => (
    <View style={[styles.scene, { backgroundColor: '#8BC34A' }]}>
      <Text>Peças</Text>
    </View>
  )

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <TabView
        style={styles.tabContainer}
        navigationState={state}
        renderScene={SceneMap({
          relatos: Relatos,
          servicos: Servicos,
          pecas: Pecas,
        })}
        onIndexChange={index => setState({index: index, routes: state.routes})}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: {
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 50,
  },

  scene: {
    flex: 1,
    marginTop: 10,
  },
  
  tabContainer: {
    flex: 1,
    marginTop: 20,
  },
  
  list: {
    paddingHorizontal: 5,
  },

  listItem: {
    width: Dimensions.get('window').width - 10,
    flexDirection: "row",
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
    // marginHorizontal: 10,
  },
  
  listText: {
    // flexDirection: "column",
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFFFFF',
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
  },

})
