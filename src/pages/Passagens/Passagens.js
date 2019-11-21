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

import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car.json'

const querystring = require('querystring')

const colors = ['#00BFFF', '#1E90FF'];

export default function Passagens({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [placa, setPlaca] = useState('')
  const [oficina, setOficina] = useState({})
  const [pass, setPass] = useState([])
  const [serv, setServ] = useState([])
  const [peca, setPeca] = useState([])

  const [state, setState] = useState({
    index: 0,
    routes: [
      { key: 'passagem', title: 'Passagens' },
      { key: 'servicos', title: 'Serviços' },
      { key: 'pecas', title: 'Peças' },
    ],
  })

  useEffect(() => {
    setIsLoading(true)
    setPlaca(navigation.getParam('placa'))

    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      async function buscaPas() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcpas',
            pmetodo: 'listaPassagens',
            pcodprg: '',
            pemail: email,
            pplaca: placa,
          })).then(response => {
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttfccpvl } = response.data.ProDataSet
                setPass(ttfccpvl)
                if (ttfccpvl !== undefined) {
                  bServ(ttfccpvl[0].placa)
                  bPeca(ttfccpvl[0].placa)
                }
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
      buscaPas()
    })
  }, [email, oficina])
  
  // console.log('placa', placa)
  // console.log('oficina', oficina)
  // console.log('serv', serv)
  
  const bServ = (placa) => {
    setIsLoading(true)
    async function buscaServ() {
      try {
        await Api.post('', querystring.stringify({
          pservico: 'wfcpas',
          pmetodo: 'ListaServicos',
          pcodprg: '',
          pemail: email,
          pplaca: placa,
          ptodos: 'S'
        })).then(response => {
          if (response.status === 200) {
            if (response.data.ProDataSet !== undefined) {
              const { ttfccpvl } = response.data.ProDataSet
              setServ(ttfccpvl)
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

  const bPeca = (placa) => {
    setIsLoading(true)
    async function buscaPeca() {
      try {
        await Api.post('', querystring.stringify({
          pservico: 'wfcpas',
          pmetodo: 'ListaPecas',
          pcodprg: '',
          pemail: email,
          pplaca: placa,
          ptodos: 'S'
        })).then(response => {
          if (response.status === 200) {
            if (response.data.ProDataSet !== undefined) {
              const { ttfccpvl } = response.data.ProDataSet
              setPeca(ttfccpvl)
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

  const pressPas = (item) => {
    navigation.navigate('Passagem1', {
      idgpas: item.idgpas,
      info: item,
    })
  }

  const pressSer = (item) => {
    navigation.navigate('Infopass',{ dados: item })
  }

  const FlatList_header_pass = () => {
    var Sticky_header_View = (
      <View style={[styles.listItem, styles.header_style]}>
        <Text style={[styles.listText, { paddingLeft: 10, width: '35%', textAlign: 'left' }]}>Data</Text> 
        <Text style={[styles.listText, { width: '20%' }]}>KM</Text> 
        <Text style={[styles.listText, { width: '15%' }]}>R</Text> 
        <Text style={[styles.listText, { width: '15%' }]}>S</Text> 
        <Text style={[styles.listText, { width: '15%' }]}>P</Text> 
      </View>
    )
    return Sticky_header_View
  }
  
  const Passagem = () => (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <FlatList 
          style={styles.list}
          data={pass}
          keyExtractor={pass => pass.idgpas.toString()}
          
          // numColumns={5}
          renderItem={({ item, index }) => (
            <TouchableHighlight
              onPress={() => pressPas(item)}>
              <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[styles.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>{item.dtpsgfor}</Text> 
                <Text style={[styles.listText, { width: '20%' }]}>{item.kilome}</Text> 
                <Text style={[styles.listText, { width: '15%' }]}>{item.totrel}</Text> 
                <Text style={[styles.listText, { width: '15%' }]}>{item.totser}</Text> 
                <Text style={[styles.listText, { width: '15%' }]}>{item.totpec}</Text> 
              </View>
            </TouchableHighlight>
          )}

          ListHeaderComponent={FlatList_header_pass}
          stickyHeaderIndices={[0]}
        />

      </ImageBackground>
    </View>
  )

  const FlatList_header_pecser = () => {
    var Sticky_header_View = (
      <View style={[styles.listItem, styles.header_style]}>
        <Text style={[styles.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>Data</Text> 
        <Text style={[styles.listText, { width: '65%', textAlign: 'left', }]}>Descrição</Text> 
      </View>
    )
    return Sticky_header_View
  }
  
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
            <TouchableHighlight
              onPress={() => pressSer(item)}>
              <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[styles.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>{item.dtpsgfor}</Text> 
                <Text style={[styles.listText, { width: '65%', textAlign: 'left', }]}>{item.descri}</Text> 
              </View>
            </TouchableHighlight>
          )}

          ListHeaderComponent={FlatList_header_pecser}
          stickyHeaderIndices={[0]}
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
            <TouchableHighlight
              onPress={() => pressSer(item)}>
              <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[styles.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>{item.dtpsgfor}</Text> 
                <Text style={[styles.listText, { width: '65%', textAlign: 'left', }]}>{item.descri}</Text> 
              </View>
            </TouchableHighlight>
          )}

          ListHeaderComponent={FlatList_header_pecser}
          stickyHeaderIndices={[0]}
        />
      </ImageBackground>
    </View>
  )

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
          passagem: Passagem,
          servicos: Servicos,
          pecas: Pecas,
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
    marginTop: 38,
  },
  
  header_style: {
    fontWeight: 'bold',
    backgroundColor: '#4169E1', 
  },

  list: {
    paddingHorizontal: 5,
  },

  listItem: {
    display: "flex",
    width: Dimensions.get('window').width - 10,
    flexDirection: "row",
    flexWrap: 'wrap',
    paddingRight: 10,
    height: 50,
  },
  
  listText: {
    // fontWeight: 'bold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
    flexDirection: 'row',
    alignSelf: "center",
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
})
