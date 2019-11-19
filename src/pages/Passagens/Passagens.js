import React, { useState, useEffect } from 'react'

import {
  Alert,
  AsyncStorage,
  Button,
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
import Modal from 'react-native-modal'

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
  const [headers, setHeaders] = useState({})
  const [pass, setPass] = useState([])
  const [serv, setServ] = useState([])
  const [sVisible, setSvisible] = useState(null)

  const [state, setState] = useState({
    index: 0,
    routes: [
      { key: 'passagem', title: 'Passagens' },
      { key: 'servicos', title: 'Serviços' },
      { key: 'pecas', title: 'Peças' },
    ],
  })

  useEffect(() => {
    setPlaca(navigation.getParam('placa'))

    AsyncStorage.getItem('token').then(Token => {
      if (Token) {
        setToken(Token)
      }
    })

    const header = {
      'Authorization': token
    }
    setHeaders(header)
    setSvisible(false)
    
    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      async function buscaPas() {
        try {
          await Api.post('/v01/busca', {
            pservico: 'wfcpas',
            pmetodo: 'listaPassagens',
            pcodprg: '',
            pemail: email,
            params: {
              pplaca: placa,
            }
          },{
            headers: header
          }).then(response => {
            if (response.status === 200) {
              // console.log('data_pass', response.data.data)
              const { ttfccpvl } = response.data.data
              setPass(ttfccpvl)
              
              if (ttfccpvl !== undefined) {
                bServ(ttfccpvl[0].placa)
              }
            } 
          })
        } catch (error) {
          const { response } = error
          if (response !== undefined) {
            // console.log('1=>', response.data.errors[0])
          } else {
            // console.log('2=>', error)
          }
        }
      }
      buscaPas()
    })
  }, [email, token, oficina, sVisible])
  
  // console.log('placa', placa)
  // console.log('oficina', oficina)
  // console.log('serv', serv)
  
  const _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  const _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>Descrição do Serviço</Text>
      {_renderButton('Fechar', () => setSvisible(false))}
    </View>
  );

  const sInfo = (dados) => {
    // navigation.navigate('Infopass',{ dados: dados })
    console.log('sInfo_item', sVisible, dados)
    
    return (
      <Modal
        isVisible={sVisible}
        // backdropColor={'red'}
        backdropOpacity={1}
        animationIn={'zoomInDown'}
        animationOut={'zoomOutUp'}
        animationInTiming={1000}
        animationOutTiming={1000}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={1000}
      >
        {_renderModalContent()}
      </Modal>
    )
    
  }

  const bServ = (placa) => {
    async function buscaServ() {
      try {
        await Api.post('/v01/busca', {
          pservico: 'wfcpas',
          pmetodo: 'ListaServicos',
          pcodprg: '',
          pemail: email,
          params: {
            pplaca: placa,
            ptodos: 'S'
          }
        },{
          headers: headers
        }).then(response => {
          if (response.status === 200) {
            // console.log('data_serv', response.data.data)
            const { ttfccpvl } = response.data.data
            setServ(ttfccpvl)
          } 
        })
      } catch (error) {
        const { response } = error
        if (response !== undefined) {
          // console.log(response.data.errors[0])
        } else {
          // console.log(error)
        }
      }
    }
    buscaServ()
  }

  const pressPas = (item) => {
    // console.log('Pas_item', item)
    // setSvisible(true)
    // sInfo(item)
    navigation.navigate('Infopass',{ dados: item })
  }

  const pressSer = (item) => {
    this.setSvisible(true)
    sInfo(item)
  }

  const Passagem = () => (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <View style={[styles.listItem, { backgroundColor: '#4169E1' }]}>
          <Text style={[styles.listText, { width: '35%', textAlign: 'left' }]}>Data</Text> 
          <Text style={[styles.listText, { width: '20%', textAlign: 'right' }]}>KM</Text> 
          <Text style={[styles.listText, { width: '15%', textAlign: 'right' }]}>R</Text> 
          <Text style={[styles.listText, { width: '15%', textAlign: 'right' }]}>S</Text> 
          <Text style={[styles.listText, { width: '15%', textAlign: 'right' }]}>P</Text> 
        </View>
        
        <FlatList 
          style={styles.list}
          data={pass}
          keyExtractor={pass => pass.idgpas.toString()}
          
          // numColumns={5}
          renderItem={({ item, index }) => (
            <TouchableHighlight
              onPress={() => pressPas(item)}>
              <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[styles.listText, { width: '35%' }]}>{item.dtpsgfor}</Text> 
                <Text style={[styles.listText, { width: '20%' }]}>{item.kilome}</Text> 
                <Text style={[styles.listText, { width: '15%' }]}>{item.totrel}</Text> 
                <Text style={[styles.listText, { width: '15%' }]}>{item.totser}</Text> 
                <Text style={[styles.listText, { width: '15%' }]}>{item.totpec}</Text> 
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
            <TouchableHighlight
              onPress={() => pressSer(item)}>
              <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[styles.listText, { width: '35%' }]}>{item.dtpsgfor}</Text> 
                <Text style={[styles.listText, { width: '65%' }]}>{item.descri}</Text> 
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
{/*         
        <FlatList 
          style={styles.list}
          data={serv}
          keyExtractor={serv => `${serv.idgpas}${serv.descri}`}

          renderItem={({ item, index }) => (
            <TouchableHighlight
              onPress={() => pressSer(item)}>
              <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[styles.listText, { width: '35%' }]}>{item.dtpsgfor}</Text> 
                <Text style={[styles.listText, { width: '65%' }]}>{item.descri}</Text> 
              </View>
            </TouchableHighlight>
          )}
        /> 
*/}
      </ImageBackground>
    </View>
  )

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
    paddingRight: 10,
  },
  
  listText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'right',
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
