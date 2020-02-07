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

import {Container, Header, Tab, Tabs, TabHeading, Icon } from 'native-base'
import Lottie from 'lottie-react-native'

import GlobalStyles, { colors, _url } from '../../GlobalStyles'
import Api from '../../services/oapi'

import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car-scan.json'

const { width, height } = Dimensions.get('window')
const querystring = require('querystring')

export default function Passagens({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [oficina, setOficina] = useState({})
  const [placa, setPlaca] = useState('')
  
  const [pass, setPass] = useState([])
  const [serv, setServ] = useState([])
  const [peca, setPeca] = useState([])

  useEffect(() => {
    setIsLoading(true)
    setPlaca(navigation.getParam('placa'))

    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      if (email !== '') {
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
              setIsLoading(false)
            } else {
              setIsLoading(false)
            }
          }
        }
        buscaPas()
      }
    })
  }, [email, oficina])
  
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
          setIsLoading(false)
        } else {
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
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      }
    }
    buscaPeca()
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

  const getRandom = () => {
    const min = 1
    const max = 100
    const rand = min + Math.random() * (max - min)
    return rand.toString()
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
          keyExtractor={pass => pass.idgpas.toString() + getRandom()}
          
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

  const pressPas = (item) => {
    navigation.navigate('Passagem', {
      idgpas: item.idgpas,
      info: item,
    })
  }

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
          keyExtractor={serv => `${serv.idgpas}${serv.descri}${getRandom()}`}

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

  const pressSer = (item) => {
    navigation.navigate('Infopass',{ dados: item })
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
          keyExtractor={peca => `${peca.idgpas}${peca.descri}${getRandom()}`}

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

  const pressLink = () => {
    navigation.navigate('Browser',{ uri: _url })
  }

  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, {marginTop: -15}]}>
      {
        pass === undefined ? 
          <Text style={styles.msgText}
            onPress={() => pressLink()}>
            Ainda não existe nenhum registro de passagem 
            em oficina para este veículo, entre em contato
            com a sua oficina e solicite o registro no 
            Ficha do Carro, é rápido, simples e sem custo,
            basta acessar o site <Text style={{color: '#FFFACD', fontWeight: 'bold',}}>{` ${_url} `}</Text>
            e seguir as instruções.
          </Text>
        :
        <Container>
          <Header hasTabs/>
          <Tabs initialPage={0}>
            <Tab heading={ <TabHeading><Icon name="md-car" /><Text style={{color:'#FFF'}}> Passagens</Text></TabHeading>}>
              {Passagem()}
            </Tab>
            <Tab heading={ <TabHeading><Icon name="md-construct" /><Text style={{color:'#FFF'}}> Serviços</Text></TabHeading>}>
              {Servicos()}
            </Tab>
            <Tab heading={ <TabHeading><Icon name="md-cog" /><Text style={{color:'#FFF'}}> Peças</Text></TabHeading>}>
              {Pecas()}
            </Tab>
          </Tabs>
        </Container>
      }
      {isLoading ? Loading() : <></>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: {
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 50,
  },

  scene: {
    flex: 1,
  },
  
  header_style: {
    fontWeight: 'bold',
    backgroundColor: '#4169E1', 
  },

  list: {
    paddingHorizontal: 5,
    flexGrow: 0,
    marginBottom: 90,
  },

  listItem: {
    display: 'flex',
    width: Dimensions.get('window').width - 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingRight: 10,
    height: 50,
  },
  
  listText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
    flexDirection: 'row',
    alignSelf: 'center',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  msgText: {
    fontSize: 18,
    color: '#FFFFFF',
    flexDirection: 'row',
    alignSelf: 'center',
    textAlign: 'justify',
    marginTop: height - (height / 2) - 40, 
    paddingRight: 10,
    width: width - 20, 
  },
  
})
