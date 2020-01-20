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

import Lottie from 'lottie-react-native'

import Globais, { getRandom } from '../../globais'
import GlobalStyles, { colors, _url } from '../../GlobalStyles'
import Api from '../../services/oapi'

import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car-scan.json'

const { width, height } = Dimensions.get('window')
const querystring = require('querystring')

export default function Promocoes({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  // const [placa, setPlaca] = useState('')
  const [oficina, setOficina] = useState({})
  const [promo, setPromo] = useState([])

  useEffect(() => {
    setIsLoading(true)
    // setPlaca(navigation.getParam('placa'))

    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      async function buscaPro() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcpas',
            pmetodo: 'buscapromocoesApp',
            pcodprg: '',
            pemail: email,
            // pplaca: placa,
          })).then(response => {
            // console.log('1=>', response)
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttpromo } = response.data.ProDataSet
                setPromo(ttpromo)
                // console.log('2=>', promo)
                /*
                if (ttpromo !== undefined) {
                  bServ(ttpromo[0].placa)
                  bPeca(ttpromo[0].placa)
                }
                */
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
      buscaPro()
    })
  }, [email, oficina])

  const pressPro = (item) => {
    navigation.navigate('InfoPromo', {
      dados: item,
    })
  }

  const FlatList_header_pro = () => {
    var Sticky_header_View = (
      <View style={[styles.listItem, styles.header_style]}>
        <Text style={[styles.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>Placa</Text>
        <Text style={[styles.listText, { width: '65%', textAlign: 'left', }]}>Descrição</Text>
      </View>
    )
    return Sticky_header_View
  }

  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, {paddingTop: 25,}]}>
      <View style={styles.scene}>
        <ImageBackground
          style={GlobalStyles.background}
          source={bg}
        >
          {
            promo === undefined ?
              <Text style={styles.msgText}>
                Não foi encontrada nenhuma promoção vigente para este veículo.
                Continue atualizando as informações de quilometragem para receber promoções exclusivas.
          </Text>
              :
              <FlatList
                style={styles.list}
                data={promo}
                keyExtractor={prom => `${promo.idprom}${promo.descri}`}

                renderItem={({ item, index }) => (
                  <TouchableHighlight
                    onPress={() => pressPro(item)}>
                    <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                      <Text style={[styles.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>{item.placa.toUpperCase()}</Text>
                      <Text style={[styles.listText, { width: '65%', textAlign: 'left', }]}>{item.descricao}</Text>
                    </View>
                  </TouchableHighlight>
                )}

                ListHeaderComponent={FlatList_header_pro}
                stickyHeaderIndices={[0]}
              />
          }
        </ImageBackground>
      </View>
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
    fontWeight: 'bold',
    backgroundColor: '#4169E1',
    // marginTop: 20,
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

})
