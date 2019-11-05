import React, { useState } from 'react'

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions
} from 'react-native'

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit'

import GlobalStyles from '../components/GlobalStyles'

import bg from '../assets/fundo-app.png'

export default function Documentos({ navigation }) {
  
  const width = Dimensions.get('window').width - 30
  const height = 220

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      >
        <View style={GlobalStyles.boxSpace}>
{/* 
          <PieChart
            data={[
              {
                name: 'Seoul',
                population: 21500000,
                color: 'rgba(131, 167, 234, 1)',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
              {
                name: 'Toronto',
                population: 2800000,
                color: '#F00',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
              {
                name: 'New York',
                population: 8538000,
                color: '#ffffff',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
              {
                name: 'Moscow',
                population: 11920000,
                color: 'rgb(0, 0, 255)',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
            ]}
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute //for the absolute number remove if you want percentage
          /> 
*/}
          <BarChart
            data={{
              labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
              ],
              datasets: [
                {
                  data: [20, 45, 28, 80, 99, 43],
                },
              ],
            }}
            width={Dimensions.get('window').width - 16}
            height={220}
            yAxisLabel={'$'}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
{/*           
          <LineChart
            data={{
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                  ]
                }
              ]
            }}
            width={width} // from react-native
            height={height}
            yAxisLabel={"$"}
            yAxisSuffix={"k"}
            chartConfig={{
              backgroundColor: "#00008B",
              backgroundGradientFrom: "#0000FF",
              backgroundGradientTo: "#87CEFA",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#87CEFA"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          /> */}

        </View>

      </ImageBackground>
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

})