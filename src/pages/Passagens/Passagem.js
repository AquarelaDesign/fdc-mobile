import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import { TabView, SceneMap } from 'react-native-tab-view'
import Lottie from 'lottie-react-native'

import GlobalStyles from '../../GlobalStyles'
import Api from '../../services/oapi'

import Infopass from './Info'
import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car.json'

const querystring = require('querystring')

const colors = ['#00BFFF', '#1E90FF'];

export default function Passagem({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [idgpas, setIdgpas] = useState(0)
  const [oficina, setOficina] = useState({})
  const [rela, setRela] = useState([])
  const [serv, setServ] = useState([])
  const [peca, setPeca] = useState([])
  const [info, setInfo] = useState([])

  const [state, setState] = useState({
    index: 0,
    routes: [
      { key: 'relatos', title: 'Relatos' },
      { key: 'servicos', title: 'Serviços' },
      { key: 'pecas', title: 'Peças' },
      { key: 'info', title: 'Info' },
    ],
  })

  useEffect(() => {
    setIsLoading(true)
    setIdgpas(navigation.getParam('idgpas'))
    setInfo(navigation.getParam('info'))

    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      async function buscaRela() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcpas',
            pmetodo: 'ListaRelatos',
            pcodprg: '',
            pemail: email,
            pidgpas: idgpas,
          })).then(response => {
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttfcrpv } = response.data.ProDataSet
                setRela(ttfcrpv)
              }
            } 
            setIsLoading(false)
          })
        } catch (error) {
          const { response } = error
          if (response !== undefined) {
            // console.log('1=>', response.data.errors[0])
            setIsLoading(false)
          } else {
            // console.log('2=>', error)
            setIsLoading(false)
          }
        }
      }
      buscaRela()
      // bServ(idgpas)
    })
  }, [email, oficina])
  
  // console.log('placa', placa)
  // console.log('oficina', oficina)
  // console.log('serv', serv)
  
  const bServ = (idgpas) => {
    setIsLoading(true)
    async function buscaServ() {
      try {
        await Api.post('', querystring.stringify({
          pservico: 'wfcpas',
          pmetodo: 'ListaServicos',
          pcodprg: '',
          pemail: email,
          pidgpas: idgpas,
        })).then(response => {
          if (response.status === 200) {
            if (response.data.ProDataSet !== undefined) {
              const { ttfcspv } = response.data.ProDataSet
              setServ(ttfcspv)
            }
          } 
          setIsLoading(false)
        })
      } catch (error) {
        const { response } = error
        if (response !== undefined) {
          // console.log(response.data.errors[0])
          setIsLoading(false)
        } else {
          // console.log(error)
          setIsLoading(false)
        }
      }
    }
    buscaServ()
  }

  const bPeca = (idgpas) => {
    setIsLoading(true)
    async function buscaPeca() {
      try {
        await Api.post('', querystring.stringify({
          pservico: 'wfcpas',
          pmetodo: 'ListaPecas',
          pcodprg: '',
          pemail: email,
          pidgpas: idgpas,
        })).then(response => {
          if (response.status === 200) {
            if (response.data.ProDataSet !== undefined) {
              const { ttfcppv } = response.data.ProDataSet
              setPeca(ttfcppv)
            }
          } 
          setIsLoading(false)
        })
      } catch (error) {
        const { response } = error
        if (response !== undefined) {
          // console.log(response.data.errors[0])
          setIsLoading(false)
        } else {
          // console.log(error)
          setIsLoading(false)
        }
      }
    }
    buscaPeca()
  }


  const Relatos = () => (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <FlatList 
          style={styles.list}
          data={rela}
          keyExtractor={rela => `${rela.idgpas}${rela.descri}`}

          renderItem={({ item, index }) => (
            <TouchableHighlight>
              <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[styles.listText, { width: '100%', textAlign: 'left', }]}>{item.descri}</Text> 
              </View>
            </TouchableHighlight>
          )}
        />
      </ImageBackground>
    </View>
  )

  const Servicos = () => (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <FlatList 
          style={styles.list}
          data={serv}
          keyExtractor={serv => `${serv.idgpas}${serv.descri}`}

          renderItem={({ item, index }) => (
            <TouchableHighlight>
              <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[styles.listText, { width: '100%', textAlign: 'left', }]}>{item.descri}</Text> 
              </View>
            </TouchableHighlight>
          )}
        />
      </ImageBackground>
    </View>
  )

  const Pecas = () => (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <FlatList 
          style={styles.list}
          data={peca}
          keyExtractor={peca => `${peca.idgpas}${peca.descri}`}

          renderItem={({ item, index }) => (
            <TouchableHighlight>
              <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[styles.listText, { width: '70%', textAlign: 'left', }]}>{item.descri}</Text> 
                <Text style={[styles.listText, { width: '30%', textAlign: 'left', }]}>{item.quant}</Text> 
              </View>
            </TouchableHighlight>
          )}
        />
      </ImageBackground>
    </View>
  )

  const Info = () => {
    return (
      <Infopass info={info} />
    )
  }

  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <TabView
        style={styles.tabContainer}
        navigationState={state}
        renderScene={SceneMap({
          relatos: Relatos,
          servicos: Servicos,
          pecas: Pecas,
          info: Info,
        })}
        onIndexChange={index => setState({index: index, routes: state.routes})}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
      {isLoading ? Loading() : <></>}
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
    marginTop: 40,
  },
  
  list: {
    paddingHorizontal: 5,
  },

  listItem: {
    width: Dimensions.get('window').width - 10,
    flexDirection: "row",
    flexWrap: 'nowrap',
    paddingRight: 10,
    height: 32,
  },
  
  listText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
    flexDirection: 'row',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },

})
