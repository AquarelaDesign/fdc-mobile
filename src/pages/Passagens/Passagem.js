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

import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import MapView, { Marker } from 'react-native-maps'
import Lottie from 'lottie-react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import GlobalStyles from '../../GlobalStyles'
import Api from '../../services/oapi'

import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car.json'

const querystring = require('querystring')
const { width, height } = Dimensions.get('window')

const colors = ['#00BFFF', '#1E90FF'];

export default function Passagem({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [idgpas, setIdgpas] = useState(0)
  const [oficina, setOficina] = useState({})
  const [rela, setRela] = useState([])
  const [serv, setServ] = useState([])
  const [peca, setPeca] = useState([])
  const [dados, setDados] = useState([])
  
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
    setDados(navigation.getParam('info'))

    async function coordenadas(dados) {
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
    }

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
      bServ(idgpas)
      bPeca(idgpas)
      coordenadas(dados)
    })
  }, [email, oficina, dados])
  
  // console.log('idgpas', idgpas)
  // console.log('info', info)
  // console.log('oficina', oficina)
  // console.log('serv', serv)

  const getTabBarIcon = (props) => {
    const { route } = props
    console.log('route.key', route.key)
      
    switch (route.key) {
      case 'relatos':
        return <Icon name='edit' size={30} color={'#FFFAF0'} />
        break
      case 'servicos':
        return <Icon name='wrench' size={30} color={'#FFFAF0'} />
        break
      case 'pecas':
        return <Icon name='cogs' size={30} color={'#FFFAF0'} />
        break
      case 'info':
        return <Icon name='info-circle' size={30} color={'#FFFAF0'} />
        break
      default:      
        return <Icon name='remove' size={30} color={'#FFFAF0'}/>
      break
    }
  }
  
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

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B",
        }}
      />
    )
  }

  const FlatList_header_pecas = () => {
    var Sticky_header_View = (
      <View style={[styles.listItem, styles.header_style]}>
        <Text style={[styles.listText, { width: '80%', textAlign: 'left', }]}>Descrição</Text> 
        <Text style={[styles.listText, { width: '20%' }]}>Qtd</Text> 
      </View>
    )
    return Sticky_header_View
  }
  
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
                <Text style={[styles.listText, { width: '80%', textAlign: 'left', }]}>{item.descri}</Text> 
                <Text style={[styles.listText, { width: '20%', }]}>{item.quant}</Text> 
              </View>
            </TouchableHighlight>
          )}

          ListHeaderComponent={FlatList_header_pecas}
          stickyHeaderIndices={[0]}
        />
      </ImageBackground>
    </View>
  )

  const Info = () => (
    <View style={styles.scene}>
      {console.log('dados', dados)}
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
          relatos: Relatos,
          servicos: Servicos,
          pecas: Pecas,
          info: Info,
        })}
        onIndexChange={index => setState({index: index, routes: state.routes})}
        initialLayout={{ height: 100, width: Dimensions.get('window').width }}
        renderTabBar={props =>
          <TabBar
            {...props}
            indicatorStyle={{backgroundColor: 'red'}}
            renderIcon={
              props => getTabBarIcon(props)
            }
            tabStyle={styles.bubble}
            labelStyle={styles.noLabel}
          />
        }
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
    height: 40,
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
    // marginTop: 3,
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
    height: 200,
    marginVertical: 50,
  },

  scene: {
    flex: 1,
  },

  noLabel: {
    display: 'none',
    height: 0
  },
  
  bubble: {
    // backgroundColor: 'lime',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10
  },

})
