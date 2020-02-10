import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {Container, Header, Tab, Tabs, TabHeading, Icon } from 'native-base'
import Lottie from 'lottie-react-native'

import GlobalStyles, { colors, _url } from '../../GlobalStyles'
import Api from '../../services/oapi'
import AtualizaKM from './AtualizaKM'

import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car-scan.json'
import cheio from '../../assets/tanque_cheio.png'
import parcial from '../../assets/tanque_parcial.png'

const { width } = Dimensions.get('window')
const querystring = require('querystring')

export default function Km({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [placa, setPlaca] = useState('')
  const [initialTab, setInitialTab] = useState(1)
  const [historico, setHistorico] = useState([])
  const [resu, setResumo] = useState([])
  
  useEffect(() => {
    setPlaca(navigation.getParam('placa'))
  }, [])

  useEffect(() => {
    setIsLoading(true)
    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      if (email !== '') {
        buscaHistorico()
      }
    })
  }, [email])
  
  const buscaHistorico = (data) => {
    setIsLoading(true)
    
    async function bHistorico() {
      try {
        await Api.post('', querystring.stringify({
          pservico: 'wfcvei',
          pmetodo: 'AtualizaKM',
          pcodprg: '',
          pemail: email,
          pplaca: placa,
        })).then(response => {
          if (response.status === 200) {
            if (response.data.ProDataSet !== undefined) {
              const { ttfckmv } = response.data.ProDataSet
              
              const kmOrd = Object.values(ttfckmv)
              .map((ttfckmv) => ({
                ...ttfckmv,
                upperCasePlaca: ttfckmv.placa.toUpperCase(),
              }))
              .sort((a, b) => a.placa > b.placa)
              
              setHistorico(kmOrd)
              if (ttfckmv !== undefined) {
                buscaResumo()
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
    
    if (data && data.length > 0) {
      const kmOrd = Object.values(data)
      .map((data) => ({
        ...data,
        upperCasePlaca: data.placa.toUpperCase(),
      }))
      .sort((a, b) => a.placa > b.placa)

      setHistorico(kmOrd)
      setIsLoading(false)
      // setInitialTab(1)
    } else {
      bHistorico()
    }
    
  }

  const buscaResumo = () => {
    setIsLoading(true)
    async function bResumo() {
      try {
        await Api.post('', querystring.stringify({
          pservico: 'wfcvei',
          pmetodo: 'ResumoKM',
          pcodprg: '',
          pemail: email,
          pplaca: placa,
      })).then(response => {
          if (response.status === 200) {
            if (response.data.ProDataSet !== undefined) {
              const { ttreskm } = response.data.ProDataSet
              // console.log('ttreskm', placa, ttreskm)
              if (ttreskm[0] !== undefined) {
                setResumo(ttreskm[0])
              }
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
    bResumo()
  }

  function Atualizacao() {
    return (
      <View style={styles.scene}>
        <AtualizaKM placa={placa} buscaHistorico={buscaHistorico} />
      </View>
    )
  }

  const FlatList_header_hist = () => {
    var Sticky_header_View = (
      <View style={[styles.listItem, styles.header_style]}>
        <Text style={[styles.listText, { paddingLeft: 10, width: '34%', textAlign: 'left' }]}>Data</Text> 
        <Text style={[styles.listText, { width: '17%' }]}>KM</Text> 
        <Text style={[styles.listText, { width: '17%' }]}>Qtde</Text> 
        <Text style={[styles.listText, { width: '17%' }]}>R$</Text> 
        <Text style={[styles.listText, { width: '15%' }]}>Tanq.</Text> 
      </View>
    )
    return Sticky_header_View
  }
  
  const Historico = () => (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <FlatList 
          style={styles.list}
          data={historico}
          keyExtractor={historico => `${historico.idgpas}${historico.hortra}`}
          
          // numColumns={5}
          renderItem={({ item, index }) => (
            <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
              <Text style={[styles.listText, { paddingLeft: 10, width: '34%', textAlign: 'left', }]}>{item.dtatufor}</Text> 
              <Text style={[styles.listText, { width: '17%' }]}>{item.kilome}</Text> 
              <Text style={[styles.listText, { width: '17%' }]}>{item.quant}</Text> 
              <Text style={[styles.listText, { width: '17%' }]}>{item.valor}</Text> 
              <Image 
                style={{flex: 1, marginTop: 5, marginLeft: 15, alignSelf: "center", }} 
                resizeMode='contain' 
                source={item.tanqch ? cheio : parcial} 
              />
            </View>
          )}

          ListHeaderComponent={FlatList_header_hist}
          stickyHeaderIndices={[0]}
        />

      </ImageBackground>
    </View>
  )

  const Resumo = () => (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      >
        <View style={styles.row}>
          <View style={[styles.vlegend, {width: '75%',}]}>
            <Text style={styles.legend}>Qtd Atualizações</Text>
          </View>
          <View style={[styles.vlegend, {width: '25%',}]}>
            <Text style={styles.text}>{resu.qtatu}</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={[styles.vlegend, {width: '75%',}]}>
            <Text style={styles.legend}>Tanque cheio</Text>
          </View>
          <View style={[styles.vlegend, {width: '25%',}]}>
            <Text style={styles.text}>{resu.qttqch}</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={[styles.vlegend, {width: '75%',}]}>
            <Text style={styles.legend}>Valor R$</Text>
          </View>
          <View style={[styles.vlegend, {width: '25%',}]}>
            <Text style={styles.text}>{resu.totval}</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={[styles.vlegend, {width: '75%',}]}>
            <Text style={styles.legend}>Média de KM rodados por dia</Text>
          </View>
          <View style={[styles.vlegend, {width: '25%',}]}>
            <Text style={styles.text}>{resu.autono}</Text>
          </View>
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
    <SafeAreaView style={[GlobalStyles.container, {marginTop: -15}]}>
      <Container>
        <Header hasTabs/>
        <Tabs initialPage={initialTab}>
          <Tab heading={ <TabHeading><Icon name="md-create" /><Text style={{color:'#FFF'}}> Atualização</Text></TabHeading>}>
            {Atualizacao()}
          </Tab>
          <Tab heading={ <TabHeading><Icon name="md-paper" /><Text style={{color:'#FFF'}}> Histórico</Text></TabHeading>}>
            {Historico()}
          </Tab>
          <Tab heading={ <TabHeading><Icon name="md-clipboard" /><Text style={{color:'#FFF'}}> Resumo</Text></TabHeading>}>
            {Resumo()}
          </Tab>
        </Tabs>
      </Container>
      {isLoading ? Loading() : <></>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    marginTop: 10,
  },
  
  tabContainer: {
    flex: 1,
    marginTop: 38,
  },

  header_style: {
    fontSize: 8,
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
    // fontWeight: 'bold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
    flexDirection: 'row',
    alignSelf: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  vlegend: {
    marginTop: 20,
    width: width,
  },

  legend: {
    fontSize: 16,
    color: '#00FFFF',
    textAlign: 'left',
    paddingLeft: 10,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#F0E68C',
    textAlign: 'right',
    paddingRight: 10,
  },


})
