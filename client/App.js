import React from 'react';
import './global';
import { web3, kit } from './root'
import { Image, StyleSheet, Text, TextInput, Button, View, YellowBox } from 'react-native';
import {   
  requestTxSig,
  waitForSignedTxs,
  requestAccountAddress,
  waitForAccountAuth,
  FeeCurrency
} from '@celo/dappkit'
import { CeloContract } from '@celo/contractkit'
import { toTxResult } from "@celo/contractkit/lib/utils/tx-result";
import { Linking } from 'expo'
import work4me from './contracts/Work4me.json'


export default class App extends React.Component {

  state = {
    Work4meContract: {}
  }

  componentDidMount = async () => {

    const instance = new web3.eth.Contract(
      work4me.abi,
      work4me && work4me.address,
      { from: this.state.account }
    );

    this.setState({ Work4meContract: instance })
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    console.log(accounts);

    await this.state.work4me.methods.openTask().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.textInput, 'ether')
    });
    console.log('Ok');
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    await this.state.work4me.methods.enter().send({
      from: accounts[0],
      value: this.state.textInput2
    });

  }

  onClickFim = async () => {
    const accounts = await web3.eth.getAccounts();

    await this.state.work4me.methods.finalizeTask().send({
      from: accounts[0]
    });

  }

  onChangeText = async (text) => {
    this.setState({textInput: text})
  }

  render(){
    return (
      <View style={styles.container}>
        <Image resizeMode='contain' source={require("./assets/logo.jpeg")}></Image>
        
        <Text style={styles.title}>Work4me SmartContract</Text>

        <Text>Hire microworkers or freelancers anywhere in the world</Text>
        <Text>With this smartcontract</Text>


        <Text style={styles.title}>Create new task {this.state.manager}</Text>

        <Text>How much to pay for the activity?</Text>

        <TextInput
          style={{ borderColor: 'black', borderWidth: 1, width: 140, marginBottom: 8, backgroundColor: 'white' }}
          placeholder="Enter the task value"
          onChangeText={text => this.onChangeText(text)}
          value={this.state.textInput}
        />
        
        <Button title="Create" 
          onPress={()=> this.onSubmit()} />
        

        <Text style={styles.title}>Receiver's Public Key</Text>
        <TextInput
          style={{ borderColor: 'black', borderWidth: 1, width: 280, marginBottom: 8, backgroundColor: 'white' }}
          placeholder="Enter the user's address"
          onChangeText={text => this.onChangeText(text)}
          value={this.state.textInput2}
        />
        
        <Button title="Start activity" 
          onPress={()=> this.onClick()} />
        
        
        <Text style={styles.title}>End task</Text>
      
        <Button style={{padding: 30}} title="Payment" 
          onPress={()=> this.onClickFim()} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#35d07f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginVertical: 8, 
    fontSize: 18, 
    fontWeight: 'bold'
  }
});