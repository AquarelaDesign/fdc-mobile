import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TextInput, 
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import { TabView, SceneMap } from 'react-native-tab-view'
import { SwitchToggle } from '@dooboo-ui/native';
import Lottie from 'lottie-react-native'

import GlobalStyles, { colors, _url } from '../../GlobalStyles'
import Api from '../../services/oapi'
import validade from '../../helpers/FormValidationRules'

import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car-scan.json'

const { width, height } = Dimensions.get('window')
const querystring = require('querystring')

export default function Km({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [placa, setPlaca] = useState('')
  const [oficina, setOficina] = useState({})
  const [historico, setHistorico] = useState([])
  const [resu, setResumo] = useState([])

  const [pkm, setPkm] = useState('')
  const [pencheu, setPencheu] = useState(false)
  const [pquant, setPquant] = useState('')
  const [pvalor, setPvalor] = useState('')


  const [state, setState] = useState({
    index: 0,
    routes: [
      { key: 'atualizacao', title: 'Atualizar' },
      { key: 'historico', title: 'Histórico' },
      { key: 'resumo', title: 'Resumo' },
    ],
  })

  useEffect(() => {
    setPlaca(navigation.getParam('placa'))
  }, [placa])

  useEffect(() => {
    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })
  }, [oficina])

  useEffect(() => {
    setIsLoading(true)
  
    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      async function buscaHistorico() {
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
                // console.log('ttfckmv-h', ttfckmv)
                setHistorico(ttfckmv)
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
            // console.log('1=>', response.data.errors[0])
            setIsLoading(false)
          } else {
            // console.log('2=>', error)
            setIsLoading(false)
          }
        }
      }
      buscaHistorico()
    })
  }, [email])
  
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

  const Atualizacao = () => (
    <View style={styles.scene}>
      
      
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <Text style={styles.placa}>{placa}</Text> 
        
        <View style={styles.row}>
          <View style={[styles.vlegend, {width: '50%',}]}>
            <Text style={styles.legend}>Quilometragem</Text>
          </View>
          <View style={[styles.vlegend, {width: '50%',}]}>
            <Text style={styles.legend}>Encheu o tanque?</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.vlegend, {width: '50%'}]}>
            <TextInput
              name='km'
              style={styles.input}
              keyboardType="numeric"
              autoCorrect={false}
              defaultValue={pkm}
              onChangeText={setPkm}
              required
            />
          </View>

          <View style={[styles.vlegend, {width: '50%', justifyContent: 'center', alignItems: 'center',}]}>
            <SwitchToggle
              containerStyle={{
                width: 100,
                height: 30,
                borderRadius: 15,
                padding: 5,
              }}
              backgroundColorOn="#a0e1e5"
              backgroundColorOff="#e5e1e0"
              circleStyle={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: 'blue',
              }}
              switchOn={pencheu}
              onPress={() => setPencheu(!pencheu)}
              circleColorOff='red'
              circleColorOn='green'
              duration={500}
            />
          </View>

        </View>

        <View style={styles.row}>
          <View style={[styles.vlegend, {width: '50%',}]}>
            <Text style={styles.legend}>Quant. Abastecida</Text>
          </View>
          <View style={[styles.vlegend, {width: '50%',}]}>
            <Text style={styles.legend}>Valor total</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.vlegend, {width: '50%'}]}>
            <TextInput
              name='quant'
              style={styles.input}
              keyboardType="numeric"
              autoCorrect={false}
              defaultValue={pquant}
              onChangeText={setPquant}
            />
          </View>
          <View style={[styles.vlegend, {width: '50%'}]}>
            <TextInput
              name='valor'
              style={styles.input}
              keyboardType="numeric"
              autoCorrect={false}
              defaultValue={pvalor}
              onChangeText={setPvalor}
            />
          </View>
        </View>

        <TouchableHighlight onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Gravar</Text>
        </TouchableHighlight>

      </ImageBackground>
    </View>
  )

  async function handleSubmit() {
    console.log('Data', pkm, pencheu, pquant, pvalor)
  }

  const FlatList_header_hist = () => {
    var Sticky_header_View = (
      <View style={[styles.listItem, styles.header_style]}>
        <Text style={[styles.listText, { paddingLeft: 10, width: '40%', textAlign: 'left' }]}>Data</Text> 
        <Text style={[styles.listText, { width: '20%' }]}>KM</Text> 
        <Text style={[styles.listText, { width: '20%' }]}>Qtde</Text> 
        <Text style={[styles.listText, { width: '20%' }]}>R$</Text> 
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
            <TouchableHighlight
              onPress={() => pressHist(item)}>
              <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={[styles.listText, { paddingLeft: 10, width: '40%', textAlign: 'left', }]}>{item.dtatufor}</Text> 
                <Text style={[styles.listText, { width: '20%' }]}>{item.kilome}</Text> 
                <Text style={[styles.listText, { width: '20%' }]}>{item.quant}</Text> 
                <Text style={[styles.listText, { width: '20%' }]}>{item.valor}</Text> 
              </View>
            </TouchableHighlight>
          )}

          ListHeaderComponent={FlatList_header_hist}
          stickyHeaderIndices={[0]}
        />

      </ImageBackground>
    </View>
  )

  const pressHist = (item) => {
    console.log('item',item)
    // navigation.navigate('Passagem1', {
    //   idgpas: item.idgpas,
    //   info: item,
    // })
  }

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
    <SafeAreaView style={GlobalStyles.container}>
      <TabView
        style={styles.tabContainer}
        navigationState={state}
        renderScene={SceneMap({
          atualizacao: Atualizacao,
          historico: Historico,
          resumo: Resumo,
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
    resizeMode: 'contain',
    alignSelf: 'center',
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

  vtext: {
    // marginTop: 5,
    width: width,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#F0E68C',
    textAlign: 'right',
    paddingRight: 10,
  },

  placa: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#FFF',
  },

  switch: {
  },

  input: {
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    marginLeft: 15, 
    marginRight: 15,
    borderRadius: 2,
    backgroundColor: '#FFF',
  },

  button: {
    height: 42,
    width: 160,
    backgroundColor: '#007189',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
})
