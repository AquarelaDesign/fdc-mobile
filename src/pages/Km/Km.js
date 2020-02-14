import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {Container, Header, Tab, Tabs, TabHeading, Icon } from 'native-base'
import { LinearGradient } from 'expo-linear-gradient'

import Lottie from 'lottie-react-native'
import GlobalStyles, {
  _url, listStyle, colors, bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import loading from '../../assets/json/car-scan.json'

import Api from '../../services/oapi'
import AtualizaKM from './AtualizaKM'

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
      <View style={[listStyle.listItem, listStyle.header_style]}>
        <Text style={[listStyle.listHeadText, { paddingLeft: 10, width: '34%', textAlign: 'left' }]}>Data</Text> 
        <Text style={[listStyle.listHeadText, { width: '17%' }]}>KM</Text> 
        <Text style={[listStyle.listHeadText, { width: '17%' }]}>Qtde</Text> 
        <Text style={[listStyle.listHeadText, { width: '17%' }]}>R$</Text> 
        <Text style={[listStyle.listHeadText, { width: '15%' }]}>Tanq.</Text> 
      </View>
    )
    return Sticky_header_View
  }
  
  const Historico = () => (
    <View style={styles.scene}>
      <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
      >
        <FlatList 
          style={listStyle.list}
          data={historico}
          keyExtractor={historico => `${historico.idgpas}${historico.hortra}`}
          
          // numColumns={5}
          renderItem={({ item, index }) => (
            <View style={[listStyle.listItem, { backgroundColor: colors[index % colors.length] }]}>
              <Text style={[listStyle.listText, { paddingLeft: 10, width: '34%', textAlign: 'left', }]}>{item.dtatufor}</Text> 
              <Text style={[listStyle.listText, { width: '17%' }]}>{item.kilome}</Text> 
              <Text style={[listStyle.listText, { width: '17%' }]}>{item.quant}</Text> 
              <Text style={[listStyle.listText, { width: '17%' }]}>{item.valor}</Text> 
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

      </LinearGradient>
    </View>
  )

  const Resumo = () => (
    <View style={styles.scene}>
      <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
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
        
      </LinearGradient>
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
          <Tab heading={ <TabHeading><Icon name="md-create" /></TabHeading>}>
            {Atualizacao()}
          </Tab>
          <Tab heading={ <TabHeading><Icon name="md-paper" /></TabHeading>}>
            {Historico()}
          </Tab>
          <Tab heading={ <TabHeading><Icon name="md-clipboard" /></TabHeading>}>
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

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  vlegend: {
    marginTop: 20,
    width: width,
  },

  legend: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
    textAlign: 'left',
    paddingLeft: 10,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FF0',
    textAlign: 'right',
    paddingRight: 10,
  },


})
