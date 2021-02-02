import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, FlatList, Linking } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';

export default function App() {
  const [name, setName] = useState('');
  const [contacts, setContacts] = useState([]);
  const [permissions, setPermissions] = useState(false);

  const call = (contact) => {
    console.log({contact})
    let phoneNumber = contact.phoneNumbers[0].number.replace(/[\(\)\-\s+]/g, '');
    console.log({phoneNumber});
    let link = `tel:${phoneNumber}`;
    Linking.canOpenURL(link)
      .then(supported => Linking.openURL(link))
      .catch(console.error);
  }

  const showContacts = async () => {
    // get all my phone contacts
    const contactList = await Contacts.getContactsAsync();
    setContacts(contactList.data);
  }

  const getPermissions = async () => {
    const {status} = await Permissions.askAsync(Permissions.CONTACTS);
    console.log({status});
    if(status === 'granted'){
      setPermissions(true);
    } else { setPermissions(false) }
  }

  useEffect( () => {
    getPermissions();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome {name}</Text>
      <Button
        onPress={()=> setName('Bob')}
        title="click me"
      ></Button>

      <Button
        onPress={showContacts}
        title="show contacts"
      ></Button>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <Button title={item.name} onPress={() => call(item)} />}
      ></FlatList>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    color: '#ff0000',
  }
});