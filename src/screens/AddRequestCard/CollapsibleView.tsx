import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';

export default function CollapsibleView({ item }: any) {
  const [active, setactive] = useState([]);
  return (
    <View>
      <Accordion
        activeSections={active}
        sections={['1']}

        // renderSectionTitle={this._renderSectionTitle}
        renderHeader={() => (<>
        {item.note?<View style={{width:'100%',justifyContent:'flex-end',flexDirection: 'row', alignSelf: 'flex-end',backgroundColor:"white"}}><TouchableOpacity
            onPress={() => {
              active.length ? setactive([]) : setactive([0]);
            }}
            style={styles.container}
          >
            <AntDesign
              name={!active.length ? 'down' : 'up'}
              size={14}
              color={'black'}
              style={styles.icon}
            />
          </TouchableOpacity></View>:null}
          </>
        )}
        renderContent={(val) => {
          return (<>
            {active.length ?
              <Animatable.Text animation="bounceIn" easing="ease-out" iterationCount={1} style={styles.animatedtext}>

                <Text style={styles.note}>
                  Note{'\n'}
                </Text>
                <Text style={styles.notedetail}>{item.note}</Text>
              </Animatable.Text> : <></>}


          </>);
        }}
      // onChange={this._updateSections}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {  },
  icon:{ marginRight: 15, opacity: 1 },
  animatedtext:{ textAlign: 'left', width: "85%", paddingHorizontal: 4 },
  note:{ fontSize: 12, fontWeight: 'bold', lineHeight: 18 },
  notedetail:{ fontSize: 12, fontWeight: 'normal' }

})