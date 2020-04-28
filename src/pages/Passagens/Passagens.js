import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import {
  Container, 
  Header, 
  Tab, 
  Tabs, 
  TabHeading, 
  Icon 
} from 'native-base'

import { LinearGradient } from 'expo-linear-gradient'
import Lottie from 'lottie-react-native'

import GlobalStyles, {
  listStyle, colors, _url, bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import Api from '../../services/oapi'

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
      <View style={[listStyle.listItem, listStyle.header_style]}>
        <Text style={[listStyle.listHeadText, { paddingLeft: 10, width: '35%', textAlign: 'left' }]}>Data</Text> 
        <Text style={[listStyle.listHeadText, { width: '20%' }]}>KM</Text> 
        <Text style={[listStyle.listHeadText, { width: '15%' }]}>
          <Icon name="md-paper" style={listStyle.listIcon}/>
        </Text> 
        <Text style={[listStyle.listHeadText, {  width: '15%' }]}>
          <Icon name="md-construct" style={listStyle.listIcon}/>
        </Text> 
        <Text style={[listStyle.listHeadText, { width: '15%' }]}>
          <Icon name="md-cog" style={listStyle.listIcon}/>
        </Text> 
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
      <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
        >
        <FlatList 
          style={listStyle.list}
          data={pass}
          keyExtractor={pass => pass.idgpas.toString() + getRandom()}
          
          renderItem={({ item, index }) => (
            <TouchableHighlight
              onPress={() => pressPas(item)}>
              <View style={[listStyle.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[listStyle.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>{item.dtpsgfor}</Text> 
                <Text style={[listStyle.listText, { width: '20%' }]}>{item.kilome}</Text> 
                <Text style={[listStyle.listText, { width: '15%' }]}>{item.totrel}</Text> 
                <Text style={[listStyle.listText, { width: '15%' }]}>{item.totser}</Text> 
                <Text style={[listStyle.listText, { width: '15%' }]}>{item.totpec}</Text> 
              </View>
            </TouchableHighlight>
          )}

          ListHeaderComponent={FlatList_header_pass}
          stickyHeaderIndices={[0]}
        />

      </LinearGradient>
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
      <View style={[listStyle.listItem, listStyle.header_style]}>
        <Text style={[listStyle.listHeadText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>Data</Text> 
        <Text style={[listStyle.listHeadText, { width: '65%', textAlign: 'left', }]}>Descrição</Text> 
      </View>
    )
    return Sticky_header_View
  }
  
  const Servicos = () => (
    <View style={styles.scene}>
      <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
        >
        <FlatList 
          style={listStyle.list}
          data={serv}
          keyExtractor={serv => `${serv.idgpas}${serv.descri}${getRandom()}`}

          renderItem={({ item, index }) => (
            <TouchableHighlight
              onPress={() => pressSer(item)}>
              <View style={[listStyle.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[listStyle.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>{item.dtpsgfor}</Text> 
                <Text style={[listStyle.listText, { width: '65%', textAlign: 'left', }]}>{item.descri}</Text> 
              </View>
            </TouchableHighlight>
          )}

          ListHeaderComponent={FlatList_header_pecser}
          stickyHeaderIndices={[0]}
        />
      </LinearGradient>
    </View>
  )

  const pressSer = (item) => {
    navigation.navigate('Infopass',{ dados: item })
  }

  const Pecas = () => (
    <View style={styles.scene}>
    <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
        >
        <FlatList 
          style={listStyle.list}
          data={peca}
          keyExtractor={peca => `${peca.idgpas}${peca.descri}${getRandom()}`}

          renderItem={({ item, index }) => (
            <TouchableHighlight
              onPress={() => pressSer(item)}>
              <View style={[listStyle.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[listStyle.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>{item.dtpsgfor}</Text> 
                <Text style={[listStyle.listText, { width: '65%', textAlign: 'left', }]}>{item.descri}</Text> 
              </View>
            </TouchableHighlight>
          )}

          ListHeaderComponent={FlatList_header_pecser}
          stickyHeaderIndices={[0]}
        />
      </LinearGradient>
    </View>
  )

  const pressLink = () => {
    navigation.navigate('Browser',{ uri: _url })
  }

  const Loading = () => {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, {marginTop: -20}]}>
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
            <Tab heading={<TabHeading style={{backgroundColor: '#0d99bf'}}><Icon name="md-car" /></TabHeading>}>
              {Passagem()}
            </Tab>
            <Tab heading={<TabHeading style={{backgroundColor: '#0d99bf'}}><Icon name="md-construct" /></TabHeading>}>
              {Servicos()}
            </Tab>
            <Tab heading={<TabHeading style={{backgroundColor: '#0d99bf'}}><Icon name="md-cog" /></TabHeading>}>
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
    // marginTop: height - (height / 2) - 40, 
    paddingRight: 10,
    width: width - 20, 
  },
  
})
